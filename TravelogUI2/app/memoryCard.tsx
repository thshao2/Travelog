import React, { useState } from "react";
import { Box, Typography, Card, Divider } from "@mui/joy";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Journal } from "./popupMenu";
import JournalDetailModal from "./journalDetail";

import { formatDate } from "./utils/util";
import { deleteJournal, editJournal } from "./utils/journalUtil";

interface MemoryCardProps {
  journal: Journal,
  onRefetch: () => void;
}

export default function MemoryCard({ journal, onRefetch }: MemoryCardProps) {
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  const closeJournalDetail = () => {
    setSelectedJournal(null);
    setIsDetailVisible(false);
  };

  // Function to delete a memory by ID
  const handleDeleteJournal = async (journalId: number, token: string) => {
    setIsDetailVisible(false);
    await deleteJournal(journalId, token);
    onRefetch();
  };

  // Function to edit a memory by ID
  const handleEditJournal = async (updatedJournal: Journal, token: string) => {
    setIsDetailVisible(false);
    await editJournal(updatedJournal, token);
    onRefetch();
  };

  return (
    <View>
      <Card onClick={() => openJournalDetail(journal)}
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
            <Typography level="inherit"
              sx={{
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