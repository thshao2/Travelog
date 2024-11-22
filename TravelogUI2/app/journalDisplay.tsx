import { Text, View, Image, Modal, Pressable, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles/journal-display-styles";

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

  return (
    <View style={styles.container}>
      <View style={styles.detailsSection}>
        <Text style={styles.detailLabel}>Category: <Text style={styles.detailText}>{journal.category}</Text></Text>
        <Text style={styles.detailLabel}>Location: <Text style={styles.detailText}>{journal.loc}</Text></Text>
        <Text style={styles.detailLabel}>Status: <Text style={styles.detailText}>{journal.condition}</Text></Text>
        <Text style={styles.detailLabel}>Start Date: <Text style={styles.detailText}>{new Date(journal.initDate).toLocaleDateString()}</Text></Text>
        <Text style={styles.detailLabel}>End Date: <Text style={styles.detailText}>{new Date(journal.endDate).toLocaleDateString()}</Text></Text>
      </View>

      <View style={styles.blogContainer}>
        {sections.map((section, index) => (
          <View key={index} style={styles.sectionContainer}>
            {section.type === "text" ? (
              <Text style={styles.journalBody}>{section.content}</Text>
            ) : (
              <TouchableOpacity
                onPress={() => setSelectedImage(section.content.startsWith("https") ? section.content : section.encodedContent)}
                style={styles.imageWrapper}
              >
                <Image
                  source={{ uri: section.content.startsWith("https") ? section.content : section.encodedContent }}
                  style={[
                    styles.image,
                    calculateImageDimensions(section.dimensions),
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        ))}
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