import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import JournalDetailModal from './journalDetail';

export type Journal = {
  id: number;  
  userId: number;
  pinId: number;
  title: string;
  category: string;
  loc: string;
  captionText: string;
  initDate: Date;
  endDate: Date;
}

interface PopupMenuProps {
  selectedPin: {
    marker: mapboxgl.Marker | null;
    position: {
        top: number;
        left: number;
    } | null;
  },
  onClose: () => void,
  onAddJournal: () => void,
}

const PopupMenu: React.FC<PopupMenuProps> = ({ selectedPin, onClose, onAddJournal }: PopupMenuProps) => {
  const [memories, setMemories] = useState<Journal[]>([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  const fetchMemoriesData = async (pinId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // const response = await fetch(`http://localhost:8080/travel/memory/user/${userId}/pin/${pinId}`, {  
      const response = await fetch(`http://localhost:8080/travel/memory/${pinId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const memoriesData: Journal[] = await response.json();
      setMemories(memoriesData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch memories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemoriesData(9999); // hard coded
  }, []);
// }, [userId, selectedPin.pinId]); // Fetch when userId or pinId changes && memoriesData change (?)

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
  };

  // Function to delete a memory by ID
  const handleDeleteJournal = async (journalId: number) => {
    setIsDetailVisible(false);
    
    try {
      const response = await fetch(`http://localhost:8080/travel/memory/${journalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete memory.');
      }
  
      const message = await response.text();
      console.log(message);
  
      // Update the memories state to remove the deleted journal
      setMemories((prevMemories) => prevMemories.filter(journal => journal.id !== journalId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete memory.');
    }
  };

  // Function to edit a memory by ID
  const handleEditJournal = async (updatedJournal: Journal) => {
    setIsDetailVisible(false);

    const response = await fetch(`http://localhost:8080/travel/memory/${updatedJournal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedJournal)
    });
  
    if (!response.ok) {
      throw new Error('Failed to edit memory.');
    }
    fetchMemoriesData(9999); 
  };

  return (
    <View
      style={[
        styles.popupMenu,
        { top: selectedPin.position?.top, left: selectedPin.position?.left },
      ]}
    >
      <Pressable onPress={onClose} style={styles.closeButton}>
        <MaterialIcons name="close" size={18} color="black" />
      </Pressable>

      {/* Display the list of previous journal entries (memories) */}
      {/* What are the point of memories??? Why are we callling openJournalModal on a memory type???*/}
      {/* Loading and Error Handling */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : memories.length > 0 ? (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Pressable
                style={styles.journalButton}
                onPress={() =>
                  openJournalDetail({
                    id: item.id,
                    userId: item.userId,
                    pinId: item.pinId,
                    title: item.title,
                    category: item.category,
                    loc: item.loc,
                    initDate: new Date(item.initDate),
                    endDate: new Date(item.endDate),
                    captionText: item.captionText,
                  })
                }
              >
                <Text style={styles.journalButtonText}>{item.title}</Text>
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
          isDetailVisible={isDetailVisible}
          setIsDetailVisible={setIsDetailVisible}
          journal={selectedJournal}
          onClose={closeJournalDetail}
          onDelete={handleDeleteJournal}
          onEdit={handleEditJournal}
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  journalButtonText: {
    textAlign: 'center',
  },
  journalButton: {
    backgroundColor: 'transparent',
    borderColor: '#000000',
    borderWidth: 1,
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
