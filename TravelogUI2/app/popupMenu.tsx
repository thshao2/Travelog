import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import JournalDetailModal from "./journalDetail";
import { useLoginContext } from "./context/LoginContext";

import config from "./config";
import DeleteConfirmationModal from "./deleteConfirmationModal";

import PopupMenuList from "./popMenuList";

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
  // refreshMemories: () => void,
}

const PopupMenu: React.FC<PopupMenuProps> = ({ selectedPin, onClose, onAddJournal, onDeletePin }: PopupMenuProps) => {
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
  }, [selectedPin.pinId]);

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
  };

  // Function to delete a memory by ID
  const handleDeleteJournal = async(journalId: number) => {
    setIsDetailVisible(false);
    
    try {
      const response = await fetch(`${API_URL}/travel/memory/${journalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete memory.");
      }
  
      const message = await response.text();
      console.log(message);
  
      // Update the memories state to remove the deleted journal
      setMemories((prevMemories) => prevMemories.filter(journal => journal.id !== journalId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete memory.");
    }
  };

  // Function to edit a memory by ID
  const handleEditJournal = async (updatedJournal: Journal) => {
    setIsDetailVisible(false);

    const response = await fetch(`${API_URL}/travel/memory/${updatedJournal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(updatedJournal),
    });
  
    if (!response.ok) {
      throw new Error("Failed to edit memory.");
    }
    await fetchMemoriesData(selectedPin.pinId);
  };

  // Function to delete the pin
  const handleDeletePin = async () => {
    setIsDeleteModalVisible(false);
    console.log("Delete pin called!");
    onDeletePin();    
  };

  return (
    <View
      style={[
        styles.popupMenu,
        { top: selectedPin.position?.top, left: selectedPin.position?.left },
      ]}
    >
      <Text style={styles.popupTitle}>Memories</Text>
      <Pressable onPress={onClose} style={styles.closeButton}>
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
          memories = {JSON.stringify(memories)}
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
          refresh={async () => {
            await fetchMemoriesData(selectedJournal.pinId);
          }}
        />
      )}

      <Pressable style={styles.menuButton} onPress={onAddJournal}>
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

const styles = StyleSheet.create({
  popupMenu: {
    position: "absolute",
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  journalButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  journalButtonText: {
    fontSize: 16,
  },
  noMemoriesText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
    marginVertical: 10,
  },
  menuButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  menuButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});