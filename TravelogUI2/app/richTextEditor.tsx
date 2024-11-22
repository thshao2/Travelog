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
// import { Section } from "./journalDetail";

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

interface ImagePreviewProps {
  isVisible: boolean;
  imageUri: string;
  onClose: () => void;
}

interface RichTextEditorProps {
  onContentChange: (newSections: Section[]) => void,
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
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

function RichTextEditor({ onContentChange, initialContent }: RichTextEditorProps) {
  const [content, setContent] = useState<(TextData | ImageData)[]>(
    initialContent ? JSON.parse(initialContent) : [{ type: "text", content: "" }],
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  
  const maxImageSize = 180;

  const getImageDimensions = (uri: string) => {
    return new Promise<{ width: number; height: number }>((resolve) => {
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

  const processImages = async (assets: any[]) => {
    const processedImages = await Promise.all(
      assets.map(async (asset) => {
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
          id: `img-${Date.now()}-${Math.random()}`,
          type: "image" as const,
          content: base64,
          encodedContent: asset.uri,
          dimensions,
        };
      }),
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
        const processedImages = await processImages(result.assets);
        const newContent = [...content, ...processedImages];
        updateContent(newContent);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const updateContent = (newContent: (TextData | ImageData)[]) => {
    setContent(newContent);
    onContentChange(newContent);
  };

  const removeImage = (imageId: string) => {
    const newContent = content.filter(
      (item) => item.type !== "image" || item.id !== imageId,
    );
    updateContent(newContent);
  };

  const handleTextChange = (text: string) => {
    const newContent = content.map((item) =>
      item.type === "text" ? { ...item, content: text } : item,
    );
    updateContent(newContent);
  };

  const handleImagePreview = (imageData: ImageData) => {
    const imageUri = imageData.content.startsWith("http")
      ? imageData.content
      : imageData.encodedContent;
    setPreviewImage(imageUri);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addImageButton} onPress={addImages}>
        <MaterialIcons name="add-photo-alternate" size={24} color="#4CAF50" />
        <Text style={styles.addImageText}>Add Images To Grid</Text>
      </TouchableOpacity>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.editor}
        showsVerticalScrollIndicator={true}
      >
        <TextInput
          style={styles.textInput}
          multiline
          value={content[0]?.content || ""}
          onChangeText={handleTextChange}
          placeholder="Write something..."
          placeholderTextColor="#999"
          textAlignVertical="top"
        />
        
        {content.length > 1 && (
          <View style={styles.gridContainer}>
            <View style={[styles.imageGrid, { gap: 8 }]}>
              {content.slice(1).map((item) => {
                if (item.type !== "image") {
                  return null;
                }
                return (
                  <View key={item.id} style={styles.imageWrapper}>
                    <TouchableOpacity onPress={() => handleImagePreview(item)}>
                      <Image
                        source={{
                          uri: item.content.startsWith("http")
                            ? item.content
                            : item.encodedContent,
                        }}
                        style={[
                          styles.gridImage,
                          {
                            width: item.dimensions.width,
                            height: item.dimensions.height,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(item.id)}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <ImagePreview
        isVisible={!!previewImage}
        imageUri={previewImage || ""}
        onClose={() => setPreviewImage(null)}
      />
    </View>
  );
}

export default RichTextEditor;