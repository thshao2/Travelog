import { Text, View, Image, Modal, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles/journal-display-styles";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box, Card, IconButton } from "@mui/material";

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

const JournalDisplay = ({ journal, groupedSections }: JournalDisplayProps) => {
  const [sections, setSections] = useState<(TextData | ImageData)[]>(groupedSections || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, _setImages] = useState<string[]>(
    sections
      .filter((section): section is ImageData => section.type === "image") // Filter ImageData entries
      .map((imageData) => imageData.content), // Extract the content property
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

  return (
    <View style={styles.container}>
      <View style={styles.detailsSection}>
        <Text style={styles.detailLabel}>Category: <Text style={styles.detailText}>{journal.category}</Text></Text>
        <Text style={styles.detailLabel}>Location: <Text style={styles.detailText}>{journal.loc}</Text></Text>
        <Text style={styles.detailLabel}>Status: <Text style={styles.detailText}>{journal.condition}</Text></Text>
        <Text style={styles.detailLabel}>Start Date: <Text style={styles.detailText}>{new Date(journal.initDate).toLocaleDateString()}</Text></Text>
        <Text style={styles.detailLabel}>End Date: <Text style={styles.detailText}>{new Date(journal.endDate).toLocaleDateString()}</Text></Text>
      </View>

      {/* This is the text content portion*/}
      <Text style={styles.journalBody}>{sections[0].content}</Text>

      {/* This is all of the images */}
      <View style={styles.blogContainer}>
        <Card
          sx={{
            padding: 2,
            display: "flex",
            mt: 5,
            flexDirection: { xs: "column", sm: "column", md: "row" },
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* Image Section */}
          <div style={{ flex: 1, margin: "1%" }}>
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
                onClick={() => setSelectedImage(images[currentImageIndex])}
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
        </Card>
      </View>

      <ImagePreview
        isVisible={!!selectedImage}
        imageUri={selectedImage || ""}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
};

export default JournalDisplay;