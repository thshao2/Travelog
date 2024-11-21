import { Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";

import { styles } from "./styles/journal-display-styles";
import { Journal } from "./popupMenu";

interface JournalDisplayProps {
	journal: Journal,
	groupedSections: any, // change
}

const JournalDisplay = ({ journal, groupedSections }: JournalDisplayProps) => {
  const maxImageSize = 200; // Medium size for images
  const [sections, setSections] = useState(groupedSections ? groupedSections : []);
  
  // Calculate image dimensions while maintaining aspect ratio
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
  
  const [imageDimensions, setImageDimensions] = useState({});

  useEffect(() => {
    setSections(groupedSections ? groupedSections : []);
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

export default JournalDisplay;