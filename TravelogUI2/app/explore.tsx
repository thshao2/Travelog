import React, { useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView, ActivityIndicator } from "react-native";
import { Box, Typography, Grid } from "@mui/joy";
import { LoginContext } from "./context/LoginContext";
import config from "./config";
import PostCard from "./postCard";
import { Journal } from "./popupMenu";
const { API_URL } = config;

export default function ExplorePage() {
  const [memories, setMemories] = useState<Journal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loginContext = useContext(LoginContext);
  const [usernames, setUsernames] = useState<Map<number, string>>(new Map());
  
  // Fetch all memories
  const fetchAllMemories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/travel/memory`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
        const uniqueUserIds = Array.from(new Set(data.map((mem: Journal) => mem.userId)));
        fetchUsernames(uniqueUserIds);
      } else {
        console.error("Error fetching all mem:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching all mem:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch usernames for unique userIds
  const fetchUsernames = async (userIds: any) => {
    try {
      const newUsernames = new Map(usernames);
      for (const userId of userIds) {
        if (!newUsernames.has(userId)) {
          const response = await fetch(`${API_URL}/user/username?userId=${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginContext.accessToken}`,
            },
          });
          if (response.ok) {
            const username = await response.text();
            newUsernames.set(userId, username);
          } else {
            console.error(`Error fetching username for userId ${userId}:`, response.statusText);
          }
        }
      }
      setUsernames(newUsernames);
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };
  
  // Refetch memories
  const handleRefetch = () => {
    fetchAllMemories();
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchAllMemories();
    }, [loginContext.accessToken]),
  );
  
  return (
    <ScrollView style={{ width: "98%", margin: "1%" }}>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <ActivityIndicator size="large" />
          </Box>
        ) : memories.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              textAlign: "center",
            }}
          >
            <Typography level="h4" sx={{ mb: 2 }}>
          Explore others' journey
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {memories.map((journal) => (
              <Grid xs={12} sm={12} md={6} key={journal.id}>
                <PostCard
                  onRefetch={handleRefetch}
                  journal={journal}
                  user={usernames.get(journal.userId) || "Unknown"}
                  edit={false}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </ScrollView>
  );
}
  