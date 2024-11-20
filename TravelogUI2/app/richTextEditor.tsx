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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const RichTextEditor = ({ onContentChange }) => {
  const [sections, setSections] = useState([{ id: "1", type: "text", content: "" }]);
  const [focusedSectionId, setFocusedSectionId] = useState("1");
  const [imageDetails, setImageDetails] = useState({});
  const inputRefs = useRef({});
  const screenWidth = Dimensions.get("window").width * 0.7; // 70% of screen width

  const getImageDimensions = (uri) => {
    return new Promise((resolve) => {
      Image.getSize(uri, (width, height) => {
        const aspectRatio = width / height;
        let finalWidth = screenWidth;
        let finalHeight = screenWidth / aspectRatio;

        // If image is taller than 70% of screen width, cap the height
        if (finalHeight > screenWidth * 1.5) {
          finalHeight = screenWidth * 1.5;
          finalWidth = finalHeight * aspectRatio;
        }

        resolve({ width: finalWidth, height: finalHeight });
      });
    });
  };

  const addImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Allow original aspect ratio
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const dimensions = await getImageDimensions(uri);
      let base64 = "";

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const newImageId = Date.now().toString();
      const currentIndex = sections.findIndex(section => section.id === focusedSectionId);
      
      // Create a new text section after the image
      const newTextSectionId = Date.now().toString() + "1";
      const newSections = [...sections];
      
      // Add the image and a new text section
      newSections.splice(currentIndex + 1, 0, 
        { id: newImageId, type: "image", content: uri, encodedContent: base64 },
        { id: newTextSectionId, type: "text", content: "" },
      );
      
      setSections(newSections);
      setImageDetails(prev => ({
        ...prev,
        [newImageId]: dimensions,
      }));
      onContentChange(newSections);
      
      // Focus the new text section
      setTimeout(() => {
        inputRefs.current[newTextSectionId]?.focus();
      }, 100);
    }
  };

  const handleTextChange = (id, text) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, content: text } : section,
    );
    setSections(newSections);
    onContentChange(newSections);
  };

  const handleKeyPress = (e, id) => {
    if (e.nativeEvent.key === "Backspace") {
      const section = sections.find(s => s.id === id);
      if (section.content === "") {
        const index = sections.findIndex(s => s.id === id);
        if (index > 0) {
          e.preventDefault();
          const newSections = [...sections];
          
          // Find adjacent text sections to merge
          const previousSection = newSections[index - 1];
          const nextSection = newSections[index + 1];
          
          if (previousSection.type === "text" && nextSection?.type === "text") {
            // Merge the text sections
            previousSection.content += nextSection.content;
            newSections.splice(index, 2); // Remove current and next section
          } else {
            // Just remove the current section
            newSections.splice(index, 1);
          }
          
          setSections(newSections);
          onContentChange(newSections);
          
          if (previousSection.type === "text") {
            setTimeout(() => {
              inputRefs.current[previousSection.id]?.focus();
            }, 0);
          }
        }
      }
    }
  };

  const removeSection = (id) => {
    const index = sections.findIndex(section => section.id === id);
    if (index === -1) return;

    const newSections = [...sections];
    newSections.splice(index, 1);

    // Check for adjacent text sections to merge
    if (index < newSections.length && index > 0) {
      const prevSection = newSections[index - 1];
      const nextSection = newSections[index];
      if (prevSection.type === "text" && nextSection.type === "text") {
        prevSection.content += nextSection.content;
        newSections.splice(index, 1);
      }
    }

    setSections(newSections);
    onContentChange(newSections);
    
    // Update image details
    const newImageDetails = { ...imageDetails };
    delete newImageDetails[id];
    setImageDetails(newImageDetails);
  };

  const addTextSection = (afterId) => {
    const index = sections.findIndex(section => section.id === afterId);
    if (index === -1) return;

    const newTextSectionId = Date.now().toString();
    const newSections = [...sections];
    newSections.splice(index + 1, 0, { id: newTextSectionId, type: "text", content: "" });
    
    setSections(newSections);
    onContentChange(newSections);
    
    setTimeout(() => {
      inputRefs.current[newTextSectionId]?.focus();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addImageButton}
        onPress={addImage}
      >
        <MaterialIcons name="add-photo-alternate" size={24} color="#4CAF50" />
      </TouchableOpacity>
      
      <ScrollView style={styles.editor}>
        {sections.map((section, index) => (
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
              />
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: section.content }}
                  style={[
                    styles.image,
                    imageDetails[section.id] ? {
                      width: imageDetails[section.id].width,
                      height: imageDetails[section.id].height,
                    } : null,
                  ]}
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.addTextButton}
                    onPress={() => addTextSection(section.id)}
                  >
                    <MaterialIcons name="text-fields" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeSection(section.id)}
                  >
                    <MaterialIcons name="close" size={20} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  editor: {
    maxHeight: 300,
  },
  section: {
    marginVertical: 5,
  },
  textInput: {
    minHeight: 40,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "top",
  },
  imageContainer: {
    position: "relative",
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
  },
  imageActions: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 4,
  },
  addTextButton: {
    marginRight: 8,
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  addImageButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default RichTextEditor;