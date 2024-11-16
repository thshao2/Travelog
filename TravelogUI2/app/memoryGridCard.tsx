import React, { useState } from "react";
import { Card, Divider, Typography, Box } from "@mui/material";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Journal } from "./popupMenu";

interface MemoryGridCarProps {
  journal: Journal,
}

export default function MemoryGridCard({ journal }: MemoryGridCarProps) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const handleClick = () => {
    console.log("clicked");
    openJournalDetail(journal);
  };

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  return (
    <View>
      <Card onClick={handleClick}
        sx={{
          position: "relative",
          padding: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "50%",
          height: 300,
        }}
      >
        {/* Image Section */}
        <Box
          component="img"
          src={"../assets/images/login-bg.jpg"}
          alt="Journal Image"
          sx={{
            width: "50%",
            height: "auto",
            objectFit: "cover",
          }}
        />
      
        {/* Content Section */}
        <div style={{ flex: 1, padding: "16px" }}>
          <Typography variant="h5">{journal.title}</Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Ionicons
              name="location"
              size={20}
              color={"#E18CA0"}
            />
            <Typography variant="h6" style={{ marginLeft: "8px" }}>
              {journal.loc}
            </Typography>
          </div>
          <Divider sx={{ marginY: 1 }} />
          <Typography variant="body1">{journal.captionText}</Typography>
          <div style={{ marginTop: "8px" }}>
            <Typography variant="caption">Status: {journal.condition}</Typography>
          </div>
          <Typography variant="h5" sx={{
            fontWeight: "bold",
            opacity: 0.7,
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: 2,
          }}>{formatDate(journal.endDate)}</Typography>
        </div>
      </Card>

      {selectedJournal && (
        <Card>Hello</Card>
      // <JournalDetailModal
      //   isDetailVisible={isDetailVisible}
      //   setIsDetailVisible={setIsDetailVisible}
      //   journal={selectedJournal}
      //   onClose={closeJournalDetail}
      //   onDelete={handleDeleteJournal}
      //   onEdit={handleEditJournal}
      // />
      )}
    </View>
  );
}

// import React, { useState, useEffect } from "react";
// import { Text, View, StyleSheet, ActivityIndicator, Image, ImageBackground } from "react-native";
// import Timeline from "react-native-timeline-flatlist";
// import { Ionicons } from "@expo/vector-icons";
// import { useLoginContext } from "./context/LoginContext";
// import { useRoute, RouteProp } from "@react-navigation/native";
// import { Journal } from "./popupMenu";
// import JournalDetailModal from "./journalDetail";
// import { RootStackParamList } from "./types";
// import config from "./config";

// const { API_URL } = config;

// interface MemoryGridCarProps {
//   journal: Journal,
// }

// export default function MemoryGridCard({ journal }: MemoryGridCarProps) {
//   const route = useRoute<RouteProp<RootStackParamList, "memoryGridCard">>();
//   const { category } = route.params;
//   const loginContext = useLoginContext();
//   const [memories, setMemories] = useState<Journal[]>([]);
//   const [isDetailVisible, setIsDetailVisible] = useState(false);
//   const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });

//   const fetchMemoriesByCategory = async() => {
//     try {
//       const endpoint =
//         category === "All"
//           ? `${API_URL}/travel/memory/user`
//           : `${API_URL}/travel/memory/category/${category}`;
  
//       const response = await fetch(endpoint, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${loginContext.accessToken}`,
//         },
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         setMemories(data);
//         calculateVisitedStats(data);
//       } else {
//         setError("Failed to fetch memories.");
//       }
//     } catch (err) {
//       setError("Error fetching memories.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateVisitedStats = (memories: Journal[]) => {
//     const visited = memories.filter((memory) => memory.condition === "Visited").length;
//     const total = memories.length;
//     const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
//     setVisitedStats({ count: visited, percentage });
//   };

//   const updateUserStats = async(token: string) => {
//     try {
//       console.log("about to post to update-stats");
//       const response = await fetch(`${API_URL}/travel/memory/update-stats`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error("updateUserStats - network response was not ok");
//       } else {
//         console.log("after post - user stats updated successfully !!!");
//       }
//     } catch (err) {
//       console.error("Error updating stats after posting pin to database: " + err);
//     }
//   };

//   const openJournalDetail = (journal: Journal) => {
//     setSelectedJournal(journal);
//     setIsDetailVisible(true);
//   };

//   const closeJournalDetail = () => {
//     setSelectedJournal(null);
//     setIsDetailVisible(false);
//   };

//   // Function to delete a memory by ID
//   const handleDeleteJournal = async(journalId: number) => {
//     setIsDetailVisible(false);
    
//     try {
//       const response = await fetch(`${API_URL}/travel/memory/${journalId}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${loginContext.accessToken}`,
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to delete memory.");
//       }
  
//       const message = await response.text();
//       console.log(message);
  
//       // Update the memories state to remove the deleted journal
//       setMemories((prevMemories) => {
//         const updatedMemories = prevMemories.filter(journal => journal.id !== journalId);
//         calculateVisitedStats(updatedMemories);
//         return updatedMemories;
//       });

//       // Update stats
//       updateUserStats(loginContext.accessToken);

//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete memory.");
//     }
//   };

//   // Function to edit a memory by ID
//   const handleEditJournal = async(updatedJournal: Journal) => {
//     setIsDetailVisible(false);

//     const response = await fetch(`${API_URL}/travel/memory/${updatedJournal.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${loginContext.accessToken}`,
//       },
//       body: JSON.stringify(updatedJournal),
//     });
  
//     if (!response.ok) {
//       throw new Error("Failed to edit memory.");
//     }
//     fetchMemoriesByCategory();
//     updateUserStats(loginContext.accessToken);
//   };

//   return (
//     <ImageBackground
//       source={require("@/assets/images/travelog-bg.jpeg")}
//       style={styles.background}
//       imageStyle={{ 
//         resizeMode: "cover",
//       }}
//     >
//       <View style={styles.container}>
//         <View style={styles.categoryButton}>
//           <Ionicons
//             name="airplane-outline"
//             size={120}
//             style={styles.iconBackground}
//           />
//           <Text style={styles.categoryButtonText}>{category}</Text>
//           <Text style={styles.categoryButtonText}>Visited: {visitedStats.count}/{memories.length} places ({visitedStats.percentage}%)</Text>
//         </View>

//         <View>
//           <Text>{journal.title}</Text>
//         </View>

//         {/* Journal Detail Modal */}
//         {selectedJournal && (
//           <JournalDetailModal
//             isDetailVisible={isDetailVisible}
//             setIsDetailVisible={setIsDetailVisible}
//             journal={selectedJournal}
//             onClose={closeJournalDetail}
//             onDelete={handleDeleteJournal}
//             onEdit={handleEditJournal}
//           />
//         )}
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: "100%",
//     height: "100%",
//   },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//   },
//   iconBackground: {
//     position: "absolute",
//     color: "rgba(255, 255, 255, 0.2)",
//     margin: -15,
//     zIndex: 0,
//   },
//   categoryButton: {
//     padding: 20,
//     backgroundColor: "#4E5BA6",
//     borderRadius: 10,
//     marginBottom: 15,
//     overflow: "hidden",
//   },
//   categoryButtonText: {
//     fontSize: 18,
//     color: "#fff",
//     textAlign: "center",
//     zIndex: 1,
//   },
// });