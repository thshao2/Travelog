import React, { useState } from "react";
import { Box, Card, Divider, Chip } from "@mui/material";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Journal } from "./popupMenu";
import { useLoginContext } from "./context/LoginContext";
import config from "./config";
import JournalDetailModal from "./journalDetail";
import { IconButton } from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Typography } from "@mui/joy";

import { formatDate } from "./utils/util";
import { updateUserStats } from "./utils/journalUtil";

const { API_URL } = config;

interface PostCardProps {
  journal: Journal;
  onRefetch: () => void;
  user: string
  edit: boolean
}

export default function PostCard({ journal, onRefetch, user, edit }: PostCardProps) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const loginContext = useLoginContext();
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

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
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
      await updateUserStats(loginContext.accessToken);
      onRefetch();
    } catch (err) {
      console.error(err);
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
      await updateUserStats(loginContext.accessToken);
      onRefetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, width: "95%", alignSelf: "center" }}>
      <Card
        sx={{
          padding: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {/* Image Section */}
        <div style={{ flex: 1 }}>
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

            {images.length > 1 && (
              <>
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
              </>
            )}

          </Box>
        </div>

        <Box sx={{ flex: 1, width: { xs: "98%", md: "30%" }, margin: "2%" }}>
          <Typography level="h4">{journal.title}</Typography>
          <Chip style={{ margin: "1%" }} label={user} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Ionicons name="location" size={20} color={"#E18CA0"} />
            <Typography
              level="inherit"
              style={{
                color: "gray",
                marginLeft: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {journal.loc}
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CalendarMonthIcon />
            <Typography
              level="inherit"
              style={{
                color: "gray",
                marginLeft: "7px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formatDate(journal.endDate)}
            </Typography>
          </div>
          <Divider sx={{ marginY: 1 }} />
          <ScrollView>
            <Box
              style={{
                marginTop: "8px",
                maxHeight: "120px",
                overflowY: "auto",
              }}
              sx={{
                minHeight: { md: "120px" },
              }}
            >
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
                    }}
                  >
                    {section.content}
                  </Typography>
                ))}
            </Box>
          </ScrollView>
        </Box>
        {edit && (
          <Ionicons name="open-outline" size={24} color="black" style={{
            top: 0,
            right: 0,
          }} onClick={() => openJournalDetail(journal)} />
        )}
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
