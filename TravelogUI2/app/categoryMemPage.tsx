import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Pressable, Image } from "react-native";
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
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.title}>{category}</Text>
        <Text style={styles.statText}>
          Visited: {visitedStats.count}/{memories.length} places ({visitedStats.percentage}%)
        </Text>
      </View>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memoryItem}>
            <Text style={styles.memoryTitle}>{item.title}</Text>
            <Text>Location: {item.loc}</Text>
            <Text>Status: {item.condition}</Text>
            <Text>From: {new Date(item.initDate).toLocaleDateString()}</Text>
            <Text>To: {new Date(item.endDate).toLocaleDateString()}</Text>
            <View>
              {JSON.parse(item.captionText).slice(0, expanded[item.id] ? undefined : 1).map((section: any, index: number) => (
                <View key={index} style={styles.sectionContainer}>
                  {section.type === "text" ? (
                    <Text numberOfLines={expanded[item.id] ? undefined : 3} ellipsizeMode="tail">
                      {section.content}
                    </Text>
                  ) : (
                    <Image source={{ uri: section.content }} style={styles.image} />
                  )}
                </View>
              ))}
            </View>
            <Pressable onPress={() => toggleExpand(item.id)}>
              <Text style={styles.expandButton}>
                {expanded[item.id] ? "Show Less" : "Show More"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.editButton}
              onPress={() =>
                openJournalDetail({
                  id: item.id,
                  userId: item.userId,
                  pinId: item.pinId,
                  title: item.title,
                  category: item.category,
                  condition: item.condition,
                  loc: item.loc,
                  initDate: new Date(item.initDate),
                  endDate: new Date(item.endDate),
                  captionText: item.captionText,
                })
              }
            >
              <Text>Edit</Text>
            </Pressable>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  statsContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  statText: {
    fontSize: 16,
    color: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  memoryItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 10,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    position: "relative",
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expandButton: {
    color: "blue",
    marginTop: 5,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});