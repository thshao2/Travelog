import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import JournalDetailModal from "./journalDetail";
import { useLoginContext } from "./context/LoginContext";
import { styles } from "./styles/popup-menu-styles";

import config from "./config";
import DeleteConfirmationModal from "./deleteConfirmationModal";

import PopupMenuList from "./popMenuList";

import { deleteJournal, editJournal } from "./utils/journalUtil";

const { API_URL } = config;

export type Journal = {
  id: number;
  userId: number;
  pinId: number;
  title: string;
  category: string;
  loc: string;
  condition: string,
  captionText: string;
  initDate: Date;
  endDate: Date;
}

interface PopupMenuProps {
  selectedPin: {
    pinId: number | null,
    marker: mapboxgl.Marker | null;
    position: {
      top: number;
      left: number;
    } | null;
  },
  onClose: () => void,
  onAddJournal: () => void,
  onDeletePin: () => void,
  onTitleClick: () => void,
}

const PopupMenu: React.FC<PopupMenuProps> = ({ selectedPin, onClose, onAddJournal, onDeletePin, onTitleClick }: PopupMenuProps) => {
  const loginContext = useLoginContext();

  const [memories, setMemories] = useState<Journal[]>([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const fetchMemoriesData = async (pinId: number | null): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/travel/memory/${pinId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const memoriesData: Journal[] = await response.json();
      setMemories(memoriesData);
      console.log("NEW MEMORIES: ------");
      console.log(memoriesData.length > 0 ? memoriesData[0].captionText : "");
      console.log("------");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch memories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemoriesData(selectedPin.pinId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPin.pinId]);

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
  };

  // Function to delete a memory by ID
  const handleDeleteJournal = async (journalId: number, token: string) => {
    setIsDetailVisible(false);
    await deleteJournal(journalId, token);
    setMemories((prevMemories) => prevMemories.filter(journal => journal.id !== journalId));
  };

  // Function to delete the pin
  const handleDeletePin = async () => {
    setIsDeleteModalVisible(false);
    console.log("Delete pin called!");
    onDeletePin();
  };

  // Function to edit a memory by ID
  const handleEditJournal = async (updatedJournal: Journal, token: string) => {
    setIsDetailVisible(false);
    await editJournal(updatedJournal, token);
    await fetchMemoriesData(selectedPin.pinId);
  };

  return (
    <View
      style={[
        styles.popupMenu,
        { top: selectedPin.position?.top, left: selectedPin.position?.left },
      ]}
    >
      <Text onPress = {onTitleClick} style={styles.popupTitle}>Memories</Text>
      <Pressable onPress={onClose} style={styles.closeButton} role="button" aria-label='close-icon'>
        <MaterialIcons name="close" size={18} color="black" />
      </Pressable>

      {/* Display the list of previous journal entries (memories) */}
      {/* Loading and Error Handling */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : memories.length > 0 ? (
        <PopupMenuList
          memories={JSON.stringify(memories)}
          setSelectedJournal={setSelectedJournal}
          setIsDetailVisible={setIsDetailVisible}
        />
      ) : (
        <Text style={styles.noMemoriesText}>No previous journals found.</Text>
      )}

      {/* Journal Detail Modal */}
      {selectedJournal && (
        <JournalDetailModal
          isDetailVisible={isDetailVisible}
          setIsDetailVisible={setIsDetailVisible}
          journal={selectedJournal}
          onClose={closeJournalDetail}
          onDelete={handleDeleteJournal}
          onEdit={handleEditJournal}
          onTitleClick={onTitleClick}
        />
      )}

      <Pressable style={styles.menuButton} onPress={onAddJournal} testID="add-journal-button">
        <Text style={styles.menuButtonText}>Add Journal</Text>
      </Pressable>

      {/* New Delete Pin Button */}
      <Pressable style={styles.deleteButton} onPress={() => setIsDeleteModalVisible(true)}>
        <Text style={styles.deleteButtonText}>Delete Pin</Text>
      </Pressable>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeletePin}
      />

    </View>
  );
};

export default PopupMenu;
