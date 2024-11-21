import React, { useState, useEffect } from "react";
import { View, TextInput, Modal, Text, ScrollView, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DatePickerInput } from "react-native-paper-dates";
import { Journal } from "./popupMenu";
import { Picker } from "@react-native-picker/picker";
import JournalDisplay from "./journalDisplay";
import RichTextEditor from "./richTextEditor";

import { styles } from "./styles/journal-detail-styles";

export interface JournalDetailProps {
  isDetailVisible: boolean,
  setIsDetailVisible: (state: boolean) => void,
  journal: Journal,
  onClose: () => void,
  onDelete: (journalId: number) => void,
  onEdit: (updatedJournal: Journal) => void,
}

export type Section = {
  id: string,
  type: string,
  content: string,
  images: Section[],
}

function JournalDetailModal({ isDetailVisible, setIsDetailVisible, journal, onClose, onDelete, onEdit }: JournalDetailProps) {
  // const journalDataTransform = (dataString: string) => {
  //   const parsedSections = JSON.parse(dataString);
  //   if (!parsedSections) {
  //     return [];
  //   }
  //   // Group consecutive images together into grids
  //   const groupedSections = [];
  //   let currentImageGroup: Section[] = [];
  //   parsedSections.forEach((section: Section, _: number) => {
  //     if (section.type === "image") {
  //       currentImageGroup.push(section);
  //     } else {
  //       if (currentImageGroup.length > 0) {
  //         groupedSections.push({
  //           type: "imageGrid",
  //           images: currentImageGroup,
  //         });
  //         currentImageGroup = [];
  //       }
  //       groupedSections.push(section);
  //     }
  //   });
    
  //   // Add any remaining images
  //   if (currentImageGroup.length > 0) {
  //     groupedSections.push({
  //       type: "imageGrid",
  //       images: currentImageGroup,
  //     });
  //   }
    
  //   return groupedSections;
  // };
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalTitle, setEditedJournalTitle] = useState(journal.title);
  const [editedJournalCategory, setEditedJournalCategory] = useState(journal.category);
  const [editedJournalLocation, setEditedJournalLocation] = useState(journal.loc);
  const [editedJournalCondition, setEditedJournalCondition] = useState(journal.condition);
  const [editedInitDate, setEditedInitDate] = useState(new Date(new Date(journal?.initDate).setHours(0, 0, 0, 0)));
  const [editedEndDate, setEditedEndDate] = useState(new Date(new Date(journal?.endDate).setHours(0, 0, 0, 0)));
  const [sections, setSections] = useState(JSON.parse(journal.captionText));
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editedJournalTitle && editedJournalLocation && editedJournalCondition && editedInitDate && editedEndDate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [editedJournalTitle, editedJournalLocation, editedJournalCondition, editedInitDate, editedEndDate]);

  useEffect(() => {
    console.log("SEctions:" + JSON.stringify(sections));
    setSections(JSON.parse(journal.captionText));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSections, journal.captionText]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditSubmit = () => {
    onEdit({
      ...journal,
      title: editedJournalTitle,
      category: editedJournalCategory,
      loc: editedJournalLocation,
      condition: editedJournalCondition, 
      initDate: editedInitDate,
      endDate: editedEndDate,
      captionText: JSON.stringify(sections),
    });

    setIsEditMode(false);
  };

  return (
    <Modal
      visible={isDetailVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsDetailVisible(false)}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>{isEditMode ? "Edit Journal" : journal.title}</Text>
              <View style={styles.iconContainer}>
                <MaterialIcons name="edit" size={24} color="black" onPress={handleEditToggle} />
                <MaterialIcons name="delete" size={24} color="red" onPress={() => onDelete(journal.id)} />
                <MaterialIcons name="close" size={24} color="black" onPress={onClose} />
              </View>
            </View>

            {isEditMode ? (
              <View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Title*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter title..."
                    value={editedJournalTitle}
                    onChangeText={setEditedJournalTitle}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Category</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter category..."
                    value={editedJournalCategory}
                    onChangeText={setEditedJournalCategory}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Location*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter location..."
                    value={editedJournalLocation}
                    onChangeText={setEditedJournalLocation}
                  />
                </View>

                {/* Status dropdown */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Status*</Text>
                  <View style={styles.dropdownContainer}>
                    <Picker
                      selectedValue={editedJournalCondition}
                      onValueChange={setEditedJournalCondition}
                      style={styles.dropdown}
                    >
                      <Picker.Item label="Visited" value="Visited" />
                      <Picker.Item label="Planned" value="Planned" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Start Date*</Text>
                  <DatePickerInput
                    locale="en"
                    label="Enter start date..."
                    value={editedInitDate}
                    onChange={(d: any) => setEditedInitDate(d)}
                    inputMode="start"
                    mode="outlined"
                    style={styles.datePicker}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>End Date*</Text>
                  <DatePickerInput
                    locale="en"
                    label="Enter end date..."
                    value={editedEndDate}
                    onChange={(d: any) => setEditedEndDate(d)}
                    inputMode="start"
                    mode="outlined"
                    style={styles.datePicker}
                  />
                </View>

                <RichTextEditor onContentChange={(newSections: Section[]) => {
                  setSections(newSections);
                  console.log(newSections, "newSections");
                }} initialContent={journal.captionText} />

                <View style={styles.buttonContainer}>
                  <Button title="Save" onPress={handleEditSubmit} disabled={!isFormValid} color="#4CAF50" />
                  <Button title="Cancel" onPress={() => setIsEditMode(false)} color="#f44336" />
                </View>
              </View>
            ) : (
              <JournalDisplay key = {JSON.stringify(sections)} journal={journal} groupedSections={sections} />
            )}
          </View>
        </View>       
      </ScrollView>
    </Modal>
  );
};

export default JournalDetailModal;

