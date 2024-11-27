import React, { useState } from "react";
import { Box, Card, Divider } from "@mui/material";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Journal } from "./popupMenu";
import { useLoginContext } from "./context/LoginContext";
import config from "./config";
import JournalDetailModal from "./journalDetail";
import { IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

import { Typography } from "@mui/joy";

const { API_URL } = config;

interface PostCardProps {
  journal: Journal;
  onRefetch: () => void;
  user: string
}

export default function PostCard({ journal, onRefetch, user }: PostCardProps) {
  console.log(user);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const loginContext = useLoginContext();
  const [_memories, setMemories] = useState<Journal[]>([]);
  const [_error, setError] = useState<string | null>(null);
  const [_visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = JSON.parse(journal.captionText)
    .filter((section: any) => section.type === "image" || section.type === "imageGrid")
    .flatMap((section: any) =>
      section.type === "image" ? [section.content] : section.images.map((img: any) => img.content),
    );

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
  };

  const calculateVisitedStats = (memories: Journal[]) => {
    const visited = memories.filter((memory) => memory.condition === "Visited").length;
    const total = memories.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
    setVisitedStats({ count: visited, percentage });
  };

  const updateUserStats = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/update-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("updateUserStats - network response was not ok");
      }
    } catch (err) {
      console.error("Error updating stats after posting pin to database: " + err);
    }
  };

  const handleDeleteJournal = async (journalId: number) => {
    setIsDetailVisible(false);

    try {
      const response = await fetch(`${API_URL}/travel/memory/${journalId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete memory.");
      }

      setMemories((prevMemories) => {
        const updatedMemories = prevMemories.filter((memory) => memory.id !== journalId);
        calculateVisitedStats(updatedMemories);
        return updatedMemories;
      });
      onRefetch();
      updateUserStats(loginContext.accessToken);
    } catch (err) {
      console.error(err);
      setError("Failed to delete memory.");
    }
  };

  const handleEditJournal = async (updatedJournal: Journal) => {
    setIsDetailVisible(false);

    try {
      const response = await fetch(`${API_URL}/travel/memory/${updatedJournal.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
        body: JSON.stringify(updatedJournal),
      });

      if (!response.ok) {
        throw new Error("Failed to edit memory.");
      }

      onRefetch();
      updateUserStats(loginContext.accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, width: "95%" }}>
      <Card
        sx={{
          //   position: "relative",
          padding: 2,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          //   flexWrap: "wrap", // Allow content to wrap
        }}
      >
        {/* Image Section */}
        <div style={{ flex: 1, width: "70%" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingBottom: "75%", // 4:3 aspect ratio
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={images[currentImageIndex] || "../assets/images/default-pic.jpg"}
              alt={`Image ${currentImageIndex + 1}`}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />

            <IconButton
              onClick={showPrevImage}
              sx={{
                position: "absolute",
                top: "50%",
                left: "8px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                zIndex: 2,
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={showNextImage}
              sx={{
                position: "absolute",
                top: "50%",
                right: "8px",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                zIndex: 2,
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: "center", marginTop: "8px" }}>
            <Typography level="inherit">
              {currentImageIndex + 1} / {images.length}
            </Typography>
          </Box>
          <Typography
            level="inherit"
            sx={{
              fontWeight: "bold",
              opacity: 0.7,
              bottom: 0,
              left: 0,
              padding: 2,
            }}
          >
            {formatDate(journal.endDate)}
          </Typography>
        </div>

        <div style={{ flex: 1, width: "30%" }}>

          <Typography level="h4">{journal.title}</Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Ionicons name="location" size={20} color={"#E18CA0"} />
            <Typography level="inherit" style={{ color: "gray", marginLeft: "8px" }}>
              {journal.loc}
            </Typography>
          </div>
          <Divider sx={{ marginY: 1 }} />
          <ScrollView>
            <div style={{
              marginTop: "8px",
              maxHeight: "50px", // Limit the height of the scrollable area
              overflowY: "auto", // Enable vertical scrolling
              paddingRight: "8px", // Add padding to prevent content from being cut off
            }}>
              {JSON.parse(journal.captionText)
                .filter((section: any) => section.type === "text")
                .map((section: any, index: number) => (
                  <Typography
                    key={index}
                    level="inherit"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                    }}
                  >
                    {section.content}
                  </Typography>
                ))}
            </div>
          </ScrollView>
        </div>
        <Ionicons name="open-outline" size={24} color="black" style={{
          top: 0,
          right: 0,
          padding: 2,
        }} onClick={() => openJournalDetail(journal)} />
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