import { Text, View, Image, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";

const JournalDisplay = ({ journal, groupedSections }) => {
  const maxImageSize = 200; // Medium size for images
  const [sections, setSections] = useState(groupedSections);
  
  // Calculate image dimensions while maintaining aspect ratio
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
  
  const [imageDimensions, setImageDimensions] = useState({});

  useEffect(() => {
    setSections(groupedSections);
  }, [groupedSections]);

  // Load image dimensions on mount
  useEffect(() => {
	  const loadDimensions = async () => {
      const dimensions = {};
      for (const section of sections) {
		  if (section.type === "imageGrid") {
          for (const image of section.images) {
			  dimensions[image.content] = await getImageDimensions(image.content);
          }
		  }
      }
      setImageDimensions(dimensions);
	  };
  
	  loadDimensions();
  }, []);
  
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
			  ) : section.type === "imageGrid" ? (
              <View style={styles.imageGrid}>
				  {section.images.map((image, imgIndex) => (
                  <View key={imgIndex} style={styles.imageWrapper}>
					  {imageDimensions[image.content] && (
                      <Image
						  source={{ uri: image.content }}
						  style={[
                          styles.gridImage,
                          {
							  width: imageDimensions[image.content].width,
							  height: imageDimensions[image.content].height,
                          },
						  ]}
                      />
					  )}
                  </View>
				  ))}
              </View>
			  ) : null}
          </View>
		  ))}
      </View>
	  </View>
  );
};
  
const styles = StyleSheet.create({
  container: {
	  flex: 1,
	  padding: 16,
  },
  detailsSection: {
	  marginBottom: 16,
	  padding: 12,
	  backgroundColor: "#f8f9fa",
	  borderRadius: 8,
  },
  detailLabel: {
	  fontSize: 16,
	  fontWeight: "600",
	  marginBottom: 8,
	  color: "#4a5568",
  },
  detailText: {
	  fontWeight: "400",
	  color: "#2d3748",
  },
  blogContainer: {
	  flex: 1,
  },
  sectionContainer: {
	  marginBottom: 16,
  },
  journalBody: {
	  fontSize: 16,
	  lineHeight: 24,
	  color: "#2d3748",
	  marginVertical: 8,
  },
  imageGrid: {
	  flexDirection: "row",
	  flexWrap: "wrap",
	  justifyContent: "flex-start",
	  gap: 8,
	  padding: 4,
	  backgroundColor: "#f8f9fa",
	  borderRadius: 8,
  },
  imageWrapper: {
	  borderRadius: 8,
	  overflow: "hidden",
	  backgroundColor: "#f8f9fa",
	  margin: 4,
	  shadowColor: "#000",
	  shadowOffset: { width: 0, height: 2 },
	  shadowOpacity: 0.1,
	  shadowRadius: 4,
	  elevation: 2,
  },
  gridImage: {
	  resizeMode: "cover",
	  borderRadius: 8,
  },
});
  
export default JournalDisplay;