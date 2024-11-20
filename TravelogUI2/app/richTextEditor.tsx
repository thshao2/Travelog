import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
  Text,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const ImagePreview = ({ isVisible, imageUri, onClose }) => {
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

const RichTextEditor = ({ onContentChange }) => {
  const [sections, setSections] = useState([{ id: "1", type: "text", content: "" }]);
  const [focusedSectionId, setFocusedSectionId] = useState("1");
  const [previewImage, setPreviewImage] = useState(null);
  const inputRefs = useRef({});
  const scrollViewRef = useRef(null);
  
  const maxImageSize = 120; // Smaller image size for grid
  const screenWidth = Dimensions.get('window').width;
  const imagesPerRow = Math.floor((screenWidth - 40) / (maxImageSize + 16)); // Calculate images per row

  const getImageDimensions = (uri) => {
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

  const processImages = async (assets) => {
    const processedImages = await Promise.all(
      assets.map(async (asset) => {
        const dimensions = await getImageDimensions(asset.uri);
        let base64 = "";

        if (Platform.OS === "web") {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
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
          dimensions
        };
      })
    );

    return processedImages;
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
        const gridId = Date.now().toString();
        const newTextSectionId = `${Date.now()}-text`;

        // Create new sections array with the grid
        const newSections = [
          ...sections.slice(0, currentIndex + 1),
          {
            id: gridId,
            type: "imageGrid",
            images: processedImages.map((img, idx) => ({
              id: `${gridId}-${idx}`,
              type: "image",
              content: img.uri,
              encodedContent: img.base64,
              dimensions: img.dimensions,
            }))
          },
          { id: newTextSectionId, type: "text", content: "" },
          ...sections.slice(currentIndex + 1)
        ];

        setSections(newSections);

        // Transform sections for the callback to match your expected format
        const encodedSections = newSections.map(section => {
          if (section.type === "imageGrid") {
            return section.images.map(img => ({
              type: "image",
              content: img.encodedContent,
            }));
          }
          return {
            type: section.type,
            content: section.content,
          };
        }).flat();

        onContentChange(encodedSections);

        // Scroll to new content
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
          inputRefs.current[newTextSectionId]?.focus();
        }, 100);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const removeImage = (gridId, imageId) => {
    const newSections = sections.map(section => {
      if (section.id === gridId && section.type === "imageGrid") {
        const updatedImages = section.images.filter(img => img.id !== imageId);
        return updatedImages.length === 0 ? null : { ...section, images: updatedImages };
      }
      return section;
    }).filter(Boolean);

    setSections(newSections);

    // Transform sections for the callback
    const encodedSections = newSections.map(section => {
      if (section.type === "imageGrid") {
        return section.images.map(img => ({
          type: "image",
          content: img.encodedContent,
        }));
      }
      return {
        type: section.type,
        content: section.content,
      };
    }).flat();

    onContentChange(encodedSections);
  };

  const handleTextChange = (id, text) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, content: text } : section
    );
    setSections(newSections);

    // Transform sections for the callback
    const encodedSections = newSections.map(section => {
      if (section.type === "imageGrid") {
        return section.images.map(img => ({
          type: "image",
          content: img.encodedContent,
        }));
      }
      return {
        type: section.type,
        content: section.content,
      };
    }).flat();

    onContentChange(encodedSections);
  };

  const handleKeyPress = (e, id) => {
    if (e.nativeEvent.key === "Backspace") {
      const section = sections.find(s => s.id === id);
      if (section?.content === "") {
        const index = sections.findIndex(s => s.id === id);
        if (index > 0) {
          e.preventDefault();
          const newSections = [...sections];
          
          const previousSection = newSections[index - 1];
          const nextSection = newSections[index + 1];
          
          if (previousSection?.type === "text" && nextSection?.type === "text") {
            previousSection.content += nextSection.content;
            newSections.splice(index, 2);
          } else {
            newSections.splice(index, 1);
          }
          
          setSections(newSections);
          
          // Transform sections for the callback
          const encodedSections = newSections.map(section => {
            if (section.type === "imageGrid") {
              return section.images.map(img => ({
                type: "image",
                content: img.encodedContent,
              }));
            }
            return {
              type: section.type,
              content: section.content,
            };
          }).flat();

          onContentChange(encodedSections);
          
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
                          }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editor: {
    maxHeight: 400,
  },
  section: {
    marginVertical: 8,
  },
  textInput: {
    minHeight: 40,
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 4,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    margin: 4,
  },
  gridImage: {
    resizeMode: 'cover',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  addImageText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
});

export default RichTextEditor;