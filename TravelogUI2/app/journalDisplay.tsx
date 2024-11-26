import { Text, View, Image, Modal, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles/journal-display-styles";
import { ImageList, ImageListItem } from "@mui/material";

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
  const maxImageSize = 180; // Matching the creation modal's max size

  useEffect(() => {
    setSections(groupedSections || []);
  }, [groupedSections, journal.captionText]);

  const calculateImageDimensions = (dimensions: { width: number; height: number }) => {
    const { width, height } = dimensions;
    const aspectRatio = width / height;

    if (width > height) {
      return {
        width: maxImageSize,
        height: maxImageSize / aspectRatio,
      };
    } else {
      return {
        width: maxImageSize * aspectRatio,
        height: maxImageSize,
      };
    }
  };

  calculateImageDimensions({ width: 200, height: 200 });

  return (
    <View style={styles.container}>
      <View style={styles.detailsSection}>
        <Text style={styles.detailLabel}>Category: <Text style={styles.detailText}>{journal.category}</Text></Text>
        <Text style={styles.detailLabel}>Location: <Text style={styles.detailText}>{journal.loc}</Text></Text>
        <Text style={styles.detailLabel}>Status: <Text style={styles.detailText}>{journal.condition}</Text></Text>
        <Text style={styles.detailLabel}>Start Date: <Text style={styles.detailText}>{new Date(journal.initDate).toLocaleDateString()}</Text></Text>
        <Text style={styles.detailLabel}>End Date: <Text style={styles.detailText}>{new Date(journal.endDate).toLocaleDateString()}</Text></Text>
      </View>

      <Text style={styles.journalBody}>{sections[0].content}</Text>
      <View style={styles.blogContainer}>
        <ImageList sx={{ width: 1000, height: 900 }} cols={4} rowHeight={164}>
          {(sections.slice(1) as ImageData[]).map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={() => setSelectedImage(section.content.startsWith("https") ? section.content : section.encodedContent)}
                style={styles.imageWrapper}
              >
                {/* <Image
                    source={{ uri: section.content.startsWith("https") ? section.content : section.encodedContent }}
                    style={[
                      styles.image,
                      calculateImageDimensions(section.dimensions),
                    ]}
                    resizeMode="contain"
                  /> */}
                <ImageListItem key={section.id}>
                  <img
                    srcSet={`${section.content.startsWith("https") ? section.content : section.encodedContent}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${section.content.startsWith("https") ? section.content : section.encodedContent}?w=164&h=164&fit=crop&auto=format`}
                    alt={"image"}
                    loading="lazy"
                  />
                  {/* <Image
                    source={{ uri: section.content.startsWith("https") ? section.content : section.encodedContent }}
                    style={[
                      styles.image,
                      calculateImageDimensions(section.dimensions),
                    ]}
                    resizeMode="contain"
                  /> */}
                </ImageListItem>
              </TouchableOpacity>
            </View>
          ))}
        </ImageList>
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