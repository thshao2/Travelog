import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import JournalDetailModal from './journalDetail';

const PopupMenu = ({ selectedPin, onClose, onAddJournal }) => {
  // Hardcoded memory data for testing
  const hardcodedMemories = [
    {
      id: 1,
      userId: 1,
      title: "UCSC",
      captionText: "My journal at UCSC",
      createdAt: "2024-10-01T10:00:00", // ISO format
      locationId: 100,
    },
  ];

  // const [memories, setMemories] = useState(hardcodedMemories);
  const [memories, setMemories] = useState('');


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const openJournalModal = (journal) => {
    setSelectedJournal(journal);  // Set the journal that was clicked
    setIsModalVisible(true);      // Open the modal
  };

  const closeJournalModal = () => {
    setSelectedJournal(null);     // Clear the selected journal
    setIsModalVisible(false);     // Close the modal
  };

  return (
    <View
      style={[
        styles.popupMenu,
        { top: selectedPin.position.top, left: selectedPin.position.left },
      ]}
    >
      <Pressable onPress={onClose} style={styles.closeButton}>
        <MaterialIcons name="close" size={18} color="black" />
      </Pressable>

      {/* Display the list of previous journal entries (memories) */}
      {memories.length > 0 ? (
        <FlatList
            data={memories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <View>
              <Pressable style={styles.journalButton} onPress={() => openJournalModal(item)}>
                <Text style={styles.journalButtonText}>
                  {item.title}
                </Text>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noMemoriesText}>No previous journals found.</Text>
      )}

      {/* Journal Detail Modal */}
      {selectedJournal && (
        <JournalDetailModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          journal={selectedJournal}
          onClose={closeJournalModal}
          onDelete={()=>console.log("delete")}
          onEdit={()=>console.log("edit")}
        />
      )}

      <Pressable style={styles.menuButton} onPress={onAddJournal}>
        <Text style={styles.menuButtonText}>Add Journal</Text>
      </Pressable>

    </View>
  );
};

export default PopupMenu;

const styles = StyleSheet.create({
  popupMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  menuButton: {
    backgroundColor: '#007aff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  noMemoriesText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  journalButtonText: {
    textAlign: 'center',
  },
  journalButton: {
    backgroundColor: 'transparent', // No filled background
    borderColor: '#000000', // Outline color
    borderWidth: 1, // Width of the outline
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  detailSection: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
  },
});

// import React from 'react';
// import { View, Pressable, Text, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// function PopupMenu ({ selectedPin, onClose, onAddJournal }) {
//   return (
//     <View
//       style={[
//         styles.popupMenu,
//         { top: selectedPin.position.top, left: selectedPin.position.left },
//       ]}
//     >
//       <Pressable onPress={onClose} style={styles.closeButton}>
//         <MaterialIcons name="close" size={18} color="black" />
//       </Pressable>
//       <Pressable style={styles.menuButton} onPress={onAddJournal}>
//         <Text style={styles.menuButtonText}>Add Journal</Text>
//       </Pressable>
//     </View>
//   );
// };

// export default PopupMenu;

// const styles = StyleSheet.create({
//   popupMenu: {
//     position: 'absolute',
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     zIndex: 1, // Ensure it's on top of other components
//   },
//   menuButton: {
//     backgroundColor: '#007aff',
//     padding: 8,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   menuButtonText: {
//     color: 'white',
//     textAlign: 'center',
//   },
//   closeButton: {
//     alignSelf: 'flex-end',
//     marginBottom: 5,
//   },
// });
