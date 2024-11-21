import React, { useState } from "react";
// import { Card, Divider, Typography, Box } from "@mui/material";
import { Box, Typography, Card, Divider } from "@mui/joy";
// Import the photo icon
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Journal } from "./popupMenu";
import { useLoginContext } from "./context/LoginContext";
import config from "./config";
import JournalDetailModal from "./journalDetail";

const { API_URL } = config;

interface MemoryCardProps {
  journal: Journal,
  onRefetch: () => void;
}

export default function MemoryCard({ journal, onRefetch }: MemoryCardProps) {
  console.log(journal.captionText);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const loginContext = useLoginContext();
  const [memories, setMemories] = useState<Journal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const handleClick = () => {
    openJournalDetail(journal);
  };

  const calculateVisitedStats = (memories: Journal[]) => {
    const visited = memories.filter((memory) => memory.condition === "Visited").length;
    const total = memories.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
    setVisitedStats({ count: visited, percentage });
  };

  const updateUserStats = async(token: string) => {
    try {
      console.log("about to post to update-stats");
      const response = await fetch(`${API_URL}/travel/memory/update-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("updateUserStats - network response was not ok");
      } else {
        console.log("after post - user stats updated successfully !!!");
      }
    } catch (err) {
      console.error("Error updating stats after posting pin to database: " + err);
    }
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
          "Authorization": `Bearer ${loginContext.accessToken}`,
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
      onRefetch();

      // Update stats
      updateUserStats(loginContext.accessToken);

    } catch (err) {
      console.error(err);
      setError("Failed to delete memory.");
    }
  };

  // Function to edit a memory by ID
  const handleEditJournal = async(updatedJournal: Journal) => {
    console.log("editing in mem card");
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
    onRefetch();
    updateUserStats(loginContext.accessToken);
  };

  return (
    <View>
      <Card onClick={handleClick}
        sx={{
          position: "relative",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {/* Image Section */}
        <Box
          component="img"
          src={
            JSON.parse(journal.captionText).find((section: any) => section.type === "image")?.content ||
    JSON.parse(journal.captionText)
      .find((section: any) => section.type === "imageGrid")
      ?.images[0]?.content ||
    "../assets/images/default-pic.jpg"
          }
          alt="Journal Image"
          sx={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />

        {/* Content Section */}
        <div style={{ flex: 1 }}>
          <Typography level="h4" sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          >{journal.title}</Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Ionicons
              name="location"
              size={20}
              color={"#E18CA0"}
            />
            <Typography level="inherit" sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "gray",
            }}
            style={{ marginLeft: "8px" }}>
              {journal.loc}
            </Typography>
          </div>
          <Divider sx={{ marginY: 1 }} />
          <div style={{ marginTop: "8px" }}>
            <Typography level="inherit">Status: {journal.condition}</Typography>
          </div>
          <br></br>
          <div>
            <Typography level="inherit" sx={{
              fontWeight: "bold",
              opacity: 0.7,
              position: "absolute",
              bottom: 0,
              right: 0,
              padding: 2,
            }}>{formatDate(journal.endDate)}</Typography>
          </div>
        </div>
      </Card>

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