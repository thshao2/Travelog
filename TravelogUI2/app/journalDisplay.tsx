import { View, Image, Modal, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, IconButton, Typography } from "@mui/material";
import { styles } from "./styles/journal-display-styles";

import Grid from "@mui/material/Grid2";

interface ImageData {
  id: string;
  type: "image";
  content: string;
  encodedContent: string;
  dimensions: {
    width: number;
    height: number;
  };
}

interface TextData {
  type: "text";
  content: string;
}

interface Journal {
  category: string;
  loc: string;
  condition: string;
  initDate: Date;
  endDate: Date;
  captionText?: string;
}

interface JournalDisplayProps {
  journal: Journal;
  groupedSections: (TextData | ImageData)[];
  clickEdit: () => void;
}

interface ImagePreviewProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
}

const ImagePreview = ({ isVisible, imageUri, onClose }: ImagePreviewProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const JournalDisplay = ({ journal, groupedSections, clickEdit }: JournalDisplayProps) => {
  const [sections, setSections] = useState<(TextData | ImageData)[]>(groupedSections || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, _setImages] = useState<string[]>(
    sections
      .filter((section): section is ImageData => section.type === "image")
      .map((imageData) => imageData.content),
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setSections(groupedSections || []);
  }, [groupedSections, journal.captionText]);

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const clickImage = () => {
    if (images[currentImageIndex] !== undefined) {
      setSelectedImage(images[currentImageIndex]);
    } else {
      clickEdit();
    }
  };

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      {/* Responsive Grid Container */}
      <Grid container spacing={2}>
        {/* Image Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ position: "relative", width: "100%", paddingBottom: "75%", backgroundColor: "#f0f0f0" }}>
            <Box
              component="img"
              onClick={() => clickImage()}
              src={images[currentImageIndex] || "https://travelog-media.s3.us-west-1.amazonaws.com/add-image.png"}
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
          {/* Image Preview Thumbnails */}
          {images.length > 1 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                mt: 2,
                gap: 1,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    width: { xs: "30%", sm: "16%" }, // 3 per row on mobile, 6 per row on desktop
                    aspectRatio: "1",
                    objectFit: "cover",
                    border: index === currentImageIndex ? "2px solid #1976d2" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Text Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">Category: {journal.category}</Typography>
          <Typography variant="subtitle1">Location: {journal.loc}</Typography>
          <Typography variant="subtitle1">Status: {journal.condition}</Typography>
          <Typography variant="subtitle1">
            Start Date: {new Date(journal.initDate).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1">
            End Date: {new Date(journal.endDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{
            mt: 2,
            wordBreak: "break-word", // Ensures long words wrap within the container
            overflowWrap: "break-word", // Fallback for better browser support
          }}>
            {sections[0]?.content || ""}
          </Typography>
        </Grid>
      </Grid>

      {/* Image Preview Modal */}
      <ImagePreview
        isVisible={!!selectedImage}
        imageUri={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />
    </Box>
  );
};

export default JournalDisplay;