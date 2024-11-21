import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Text,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

import { styles } from "./styles/rich-text-editor-styles";

import { Section } from "./journalDetail";

interface ImagePreviewProps {
  isVisible: boolean,
  imageUri: string,
  onClose: () => void,
}

interface RichTextEditorProps {
  onContentChange: (newSections: any) => void,
  initialContent: string
}

const ImagePreview = ({ isVisible, imageUri, onClose }: ImagePreviewProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

function RichTextEditor({ onContentChange, initialContent }: RichTextEditorProps) {
  const [sections, setSections] = useState<Section[]>(initialContent ? JSON.parse(initialContent) : [{ id: "1", type: "text", content: "" }]);
  const [focusedSectionId, setFocusedSectionId] = useState("1");
  const [previewImage, setPreviewImage] = useState(null);
  const inputRefs = useRef({});
  const scrollViewRef = useRef(null);
  
  const maxImageSize = 180; // Increased from 120 to 180

  const getImageDimensions = (uri: string) => {
    return new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        const aspectRatio = width / height;
        let finalWidth, finalHeight;

        if (width > height) {
          finalWidth = maxImageSize;
          finalHeight = maxImageSize / aspectRatio;
        } else {
          finalHeight = maxImageSize;
          finalWidth = maxImageSize * aspectRatio;
        }

        resolve({ width: finalWidth, height: finalHeight });
      });
    });
  };

  const processImages = async (assets: any) => {
    const processedImages = await Promise.all(
      assets.map(async (asset: any) => {
        const dimensions = await getImageDimensions(asset.uri);
        let base64 = "";

        if (Platform.OS === "web") {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } else {
          base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }

        return {
          uri: asset.uri,
          base64,
          dimensions,
        };
      }),
    );

    return processedImages;
  };

  const addImagesToGrid = async (gridId: string) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow access to your photo library to add images.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0) {
        const processedImages = await processImages(result.assets);

        console.log("HERE IS IMAGES");
        console.log(sections);
        
        const newSections = sections.map(section => {
          if (section.id === gridId && section.type === "imageGrid") {
            return {
              ...section,
              images: [
                ...section.images,
                ...processedImages.map((img, idx) => ({
                  id: `${gridId}-${Date.now()}-${idx}`,
                  type: "image",
                  content: img.base64,
                  encodedContent: img.base64,
                  dimensions: img.dimensions,
                })),
              ],
            };
          }
          return section;
        });

        updateSections(newSections);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const addImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Please allow access to your photo library to add images.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets.length > 0) {
        const currentIndex = sections.findIndex(section => section.id === focusedSectionId);
        const processedImages = await processImages(result.assets);
        
        // Check if we should add to an existing grid
        const lastSection = sections[sections.length - 1];
        const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
        const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
        
        let newSections = [...sections];
        
        // If current section is empty text and between two image grids, merge them
        if (prevSection?.type === "imageGrid" && nextSection?.type === "imageGrid" && 
            sections[currentIndex].type === "text" && sections[currentIndex].content === "") {
          const mergedImages = [...prevSection.images, ...nextSection.images];
          newSections = [
            ...sections.slice(0, currentIndex - 1),
            {
              id: prevSection.id,
              type: "imageGrid",
              images: mergedImages,
            },
            ...sections.slice(currentIndex + 2),
          ];
        } else if (lastSection.type === "text" && lastSection.content === "" && 
                sections[sections.length - 2]?.type === "imageGrid") {
          newSections = [
            ...sections.slice(0, -2),
            {
              ...sections[sections.length - 2],
              images: [
                ...sections[sections.length - 2].images,
                ...processedImages.map((img, idx) => ({
                  id: `${sections[sections.length - 2].id}-${Date.now()}-${idx}`,
                  type: "image",
                  content: img.base64,
                  encodedContent: img.base64,
                  dimensions: img.dimensions,
                })),
              ],
            },
            lastSection,
          ];
        } else {
          const gridId = Date.now().toString();
          const newTextSectionId = `${Date.now()}-text`;
          
          newSections = [
            ...sections.slice(0, currentIndex + 1),
            {
              id: gridId,
              type: "imageGrid",
              images: processedImages.map((img, idx) => ({
                id: `${gridId}-${idx}`,
                type: "image",
                content: img.base64,
                encodedContent: img.base64,
                dimensions: img.dimensions,
              })),
            },
            { id: newTextSectionId, type: "text", content: "" },
            ...sections.slice(currentIndex + 1),
          ];
        }
        updateSections(newSections);

        // Scroll to new content
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
          const lastTextSection = newSections.filter(s => s.type === "text").pop();
          if (lastTextSection) {
            inputRefs.current[lastTextSection.id]?.focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const updateSections = (newSections: Section[]) => {
    setSections(newSections);
    onContentChange(newSections);
  };

  const removeImage = (gridId: string, imageId: string) => {
    const gridIndex = sections.findIndex(section => section.id === gridId);
    const currentGrid = sections[gridIndex];
    
    // Remove the specified image
    const updatedImages = currentGrid.images.filter(img => img.id !== imageId);
    
    let newSections = [...sections];
    
    // If this was the last image in the grid
    if (updatedImages.length === 0) {
      // Check for adjacent text sections
      const prevSection = gridIndex > 0 ? sections[gridIndex - 1] : null;
      const nextSection = gridIndex < sections.length - 1 ? sections[gridIndex + 1] : null;
      
      // If we have text sections on both sides, merge them
      if (prevSection?.type === "text" && nextSection?.type === "text") {
        newSections = [
          ...sections.slice(0, gridIndex - 1),
          {
            id: prevSection.id,
            type: "text",
            content: prevSection.content + nextSection.content,
          },
          ...sections.slice(gridIndex + 2),
        ];
        
        // Focus the merged text section
        setTimeout(() => {
          inputRefs.current[prevSection.id]?.focus();
        }, 0);
      } else {
        // Just remove the empty grid
        newSections = [
          ...sections.slice(0, gridIndex),
          ...sections.slice(gridIndex + 1),
        ];
      }
    } else {
      // Update the grid with remaining images
      newSections = sections.map(section => 
        section.id === gridId ? { ...section, images: updatedImages } : section,
      );
    }
    
    updateSections(newSections);
  };

  const handleTextChange = (id: string, text: string) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, content: text } : section,
    );
    updateSections(newSections);
  };

  const handleKeyPress = (e, id: string) => {
    if (e.nativeEvent.key === "Backspace") {
      const section = sections.find(s => s.id === id);
      if (section?.content === "") {
        const index = sections.findIndex(s => s.id === id);
        if (index > 0) {
          e.preventDefault();
          const newSections = [...sections];
          
          const previousSection = newSections[index - 1];
          const nextSection = newSections[index + 1];
          
          // If deleting text between two image grids, merge them
          if (previousSection?.type === "imageGrid" && nextSection?.type === "imageGrid") {
            const mergedImages = [...previousSection.images, ...nextSection.images];
            newSections.splice(index - 1, 3, {
              id: previousSection.id,
              type: "imageGrid",
              images: mergedImages,
            });
          } else if (previousSection?.type === "text" && nextSection?.type === "text") {
            previousSection.content += nextSection.content;
            newSections.splice(index, 2);
          } else {
            newSections.splice(index, 1);
          }
          
          updateSections(newSections);
          
          if (previousSection?.type === "text") {
            setTimeout(() => {
              inputRefs.current[previousSection.id]?.focus();
            }, 0);
          }
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addImageButton}
        onPress={addImages}
      >
        <MaterialIcons name="add-photo-alternate" size={24} color="#4CAF50" />
        <Text style={styles.addImageText}>Add Images</Text>
      </TouchableOpacity>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.editor}
        showsVerticalScrollIndicator={true}
      >
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            {section.type === "text" ? (
              <TextInput
                ref={ref => inputRefs.current[section.id] = ref}
                style={styles.textInput}
                multiline
                value={section.content}
                onChangeText={(text) => handleTextChange(section.id, text)}
                onFocus={() => setFocusedSectionId(section.id)}
                onKeyPress={(e) => handleKeyPress(e, section.id)}
                placeholder="Write something..."
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
            ) : section.type === "imageGrid" ? (
              <View style={styles.gridContainer}>
                <View style={[styles.imageGrid, { gap: 8 }]}>
                  {section.images.map((image) => (
                    <View key={image.id} style={styles.imageWrapper}>
                      <TouchableOpacity
                        onPress={() => setPreviewImage(image.content)}
                      >
                        <Image
                          source={{ uri: image.content }}
                          style={[
                            styles.gridImage,
                            {
                              width: image.dimensions.width,
                              height: image.dimensions.height,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(section.id, image.id)}
                      >
                        <MaterialIcons name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.addToGridButton}
                  onPress={() => addImagesToGrid(section.id)}
                >
                  <MaterialIcons name="add-photo-alternate" size={20} color="#4CAF50" />
                  <Text style={styles.addToGridText}>Add to Grid</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <ImagePreview
        isVisible={!!previewImage}
        imageUri={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </View>
  );
};

export default RichTextEditor;