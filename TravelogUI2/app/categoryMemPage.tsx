import React, { useState, useEffect } from "react";
import { Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Grid, Typography } from "@mui/joy";
import { useLoginContext } from "./context/LoginContext";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Journal } from "./popupMenu";
import { RootStackParamList } from "./types";
import config from "./config";
import Slider from "react-slick";
import { Box } from "@mui/material";

import MemoryCard from "./memoryCard";

const { API_URL } = config;

// REPLACE W FETCHED S3 URLS
const images = [
  // "https://images8.alphacoders.com/103/1039011.jpg",
  // "https://wallpapers.com/images/featured/vegas-4k-9gsywswzyt0y5l6f.jpg",
  // "https://images.alphacoders.com/905/thumb-1920-905423.jpg",
  "https://images.unsplash.com/photo-1541292426587-b6ca8230532b?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1541472555878-357a209eb293?q=80&w=2570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1541989198-c38e77540004?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1541918602878-4e1ebfc7b739?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// const [images, setImages] = useState([]);

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

export default function CategoryMemPage() {
  const route = useRoute<RouteProp<RootStackParamList, "categoryMemPage">>();
  const { category } = route.params;
  const loginContext = useLoginContext();
  const [memories, setMemories] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });

  const fetchMemoriesByCategory = async() => {
    try {
      const endpoint =
        category === "All"
          ? `${API_URL}/travel/memory/user`
          : `${API_URL}/travel/memory/category/${category}`;
  
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
        calculateVisitedStats(data);
      } else {
        setError("Failed to fetch memories.");
      }

    } catch (err) {
      setError("Error fetching memories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // KEEP - FRONTEND FOR OVERVIEW
  // useEffect(() => {
  //   fetchOverviewUrls();
  // }, []);
  // 
  // const fetchOverviewUrls = async() => {
  //   try {
  //     // get slideshow urls:
  //     const url_response = await fetch(`${API_URL}/travel/memory/category-overview/${route.params}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${loginContext.accessToken}`,
  //       },
  //     });
  //     if (!url_response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const url_data = await url_response.json();
  //     setImages(url_data);

  //   } catch (err) {
  //     setError("Error fetching slideshow urls.");
  //     console.error(err);
  //   }
  // };

  const calculateVisitedStats = (memories: Journal[]) => {
    const visited = memories.filter((memory) => memory.condition === "Visited").length;
    const total = memories.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
    setVisitedStats({ count: visited, percentage });
  };

  useEffect(() => {
    fetchMemoriesByCategory();
  }, [category]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <ScrollView>
      <Typography level="h3" sx={{
        alignSelf: "center",
        fontWeight: "bold",
        paddingTop: 2,
      }}>{category}</Typography>
      <Typography level="h4" sx={{
        alignSelf: "center",
      }}>Visited: {visitedStats.count}/{memories.length} places ({visitedStats.percentage}%)</Typography>
      
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        gap: 4,
        padding: 2,
      }}>
        <Box sx={{
          flex: 2,
        }}>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {memories.map((journal) => (
              <Grid
                key={journal.id}
                xs={12} sm={4} md={3}
              >
                <MemoryCard onRefetch={fetchMemoriesByCategory} journal={journal} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",           
            width: "33%",            
            height: "100%",              
            overflow: "hidden",         
            flexDirection: "column", 
            marginTop: "15px",     
          }}
        >
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Slide ${index + 1}`}
                sx={{     
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ))}
          </Slider>
        </Box>
     
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

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

// export default function CategoryMemPage() {
//   const route = useRoute<RouteProp<RootStackParamList, "categoryMemPage">>();
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

//   useEffect(() => {
//     fetchMemoriesByCategory();
//   }, [category]);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#0000ff" />;
//   }
//   if (error) {
//     return <Text style={styles.errorText}>{error}</Text>;
//   }

//   const timelineData = memories.map((memory) => {
//     return {
//       id: memory.id,
//       userId: memory.userId,
//       pinId: memory.pinId,
//       title: memory.title,
//       category: memory.category,
//       condition: memory.condition,
//       loc: memory.loc,
//       time: new Date(memory.endDate).toLocaleDateString(),
//       initDate: memory.initDate,
//       endDate: memory.endDate,
//       captionText: memory.captionText,
//       imageUrl: JSON.parse(memory.captionText).find((section: any) => section.type === "image")?.content || null, // use the 1st img from captionText if available
//     };
//   });

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
      
//         <Timeline
//           data={timelineData}
//           circleSize={20}
//           circleColor="#132087"
//           lineColor="#132087"
//           innerCircle={"icon"}
//           timeContainerStyle={{ minWidth: 80, marginTop: 5 }}
//           timeStyle={{
//             textAlign: "center",
//             backgroundColor: "#132087",
//             color: "white",
//             padding: 5,
//             borderRadius: 13,
//           }}
//           onEventPress={(rowData: any) => {
//             openJournalDetail({
//               id: rowData.id,
//               userId: rowData.userId,
//               pinId: rowData.pinId,
//               title: rowData.title,
//               category: rowData.category,
//               condition: rowData.condition,
//               loc: rowData.loc,
//               initDate: rowData.initDate,
//               endDate: rowData.endDate,
//               captionText: rowData.captionText,
//             });
//           }}
//           renderDetail={(rowData) => (
//             <View style={{ flexDirection: "row", marginLeft: 10 }}>
//               <Image
//                 source={{ uri: rowData.imageUrl || "assets/images/pfp-background.jpg" }}
//                 style={{
//                   width: 120,
//                   height: 120,
//                   borderRadius: 10,
//                   marginBottom: 8,
//                 }}
//               />
//               <View style={{ flexDirection: "column", marginLeft: 15 }}>
//                 <Text style={{ fontSize: 20, fontWeight: "bold" }}>{rowData.title}</Text>
//                 <View style={{ flexDirection: "row", marginTop: 10 }}>
//                   <Ionicons name={"location-sharp"} size={16} color={"#132087"} />
//                   <Text style={{ fontSize: 16, color: "#424242", marginLeft: 5 }}>{rowData.loc}</Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         />

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