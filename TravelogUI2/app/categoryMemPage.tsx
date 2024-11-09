import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Image, ImageBackground } from "react-native";
import Timeline from "react-native-timeline-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { useLoginContext } from "./context/LoginContext";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Journal } from "./popupMenu";
import JournalDetailModal from "./journalDetail";
import { RootStackParamList } from "./types";
import config from "./config";

const { API_URL } = config;

export default function CategoryMemPage() {
  const route = useRoute<RouteProp<RootStackParamList, "categoryMemPage">>();
  const { category } = route.params;
  const loginContext = useLoginContext();
  const token = loginContext.accessToken;

  const [memories, setMemories] = useState<Journal[]>([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
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
          "Authorization": `Bearer ${token}`,
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

  const calculateVisitedStats = (memories: Journal[]) => {
    const visited = memories.filter((memory) => memory.condition === "Visited").length;
    const total = memories.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
    setVisitedStats({ count: visited, percentage });
  };

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

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
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete memory.");
      }
  
      const message = await response.text();
      console.log(message);
  
      // Update the memories state to remove the deleted journal
      setMemories((prevMemories) => {
        const updatedMemories = prevMemories.filter(journal => journal.id !== journalId);
        calculateVisitedStats(updatedMemories);
        return updatedMemories;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete memory.");
    }
  };

  // Function to edit a memory by ID
  const handleEditJournal = async(updatedJournal: Journal) => {
    setIsDetailVisible(false);

    const response = await fetch(`${API_URL}/travel/memory/${updatedJournal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updatedJournal),
    });
  
    if (!response.ok) {
      throw new Error("Failed to edit memory.");
    }
    fetchMemoriesByCategory(); 
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

  const timelineData = memories.map((memory) => {
    return {
      id: memory.id,
      userId: memory.userId,
      pinId: memory.pinId,
      title: memory.title,
      category: memory.category,
      condition: memory.condition,
      loc: memory.loc,
      time: new Date(memory.endDate).toLocaleDateString(),
      initDate: memory.initDate,
      endDate: memory.endDate,
      captionText: memory.captionText,
      imageUrl: JSON.parse(memory.captionText).find((section: any) => section.type === "image")?.content || null, // use the 1st img from captionText if available
    };
  });

  return (
    <ImageBackground
      source={require("@/assets/images/travelog-bg.jpeg")}
      style={styles.background}
      imageStyle={{ 
        resizeMode: "cover",
      }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name={"airplane-outline"} size={50} color={"#132087"} />
            <View style={styles.content}>
              <Text style={styles.title}>{category}</Text>
              <Text style={styles.stat}>Visited: {visitedStats.count}/{memories.length} places ({visitedStats.percentage}%)</Text>
            </View>
          </View>
        </View>
      
        <Timeline
          data={timelineData}
          circleSize={20}
          circleColor="#132087"
          lineColor="#132087"
          innerCircle={"icon"}
          timeContainerStyle={{ minWidth: 80, marginTop: 5 }}
          timeStyle={{
            textAlign: "center",
            backgroundColor: "#132087",
            color: "white",
            padding: 5,
            borderRadius: 13,
          }}
          onEventPress={(rowData: any) => {
            openJournalDetail({
              id: rowData.id,
              userId: rowData.userId,
              pinId: rowData.pinId,
              title: rowData.title,
              category: rowData.category,
              condition: rowData.condition,
              loc: rowData.loc,
              initDate: rowData.initDate,
              endDate: rowData.endDate,
              captionText: rowData.captionText,
            });
          }}
          renderDetail={(rowData) => (
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              <Image
                source={{ uri: rowData.imageUrl || "assets/images/pfp-background.jpg" }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              />
              <View style={{ flexDirection: "column", marginLeft: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{rowData.title}</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <Ionicons name={"location-sharp"} size={16} color={"#132087"} />
                  <Text style={{ fontSize: 16, color: "#424242", marginLeft: 5 }}>{rowData.loc}</Text>
                </View>
              </View>
            </View>
          )}
        />

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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: "#132087",
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  content: {
    alignItems: "center",
  },
  stat: {
    fontSize: 16,
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});