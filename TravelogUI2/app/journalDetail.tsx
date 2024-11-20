import React, { useState, useEffect } from "react";
import { View, TextInput, Modal, Text, StyleSheet, ScrollView, Button } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DatePickerInput } from "react-native-paper-dates";
import { Journal } from "./popupMenu";
import { Picker } from "@react-native-picker/picker";
import JournalDisplay from "./journalDisplay";
import RichTextEditor from "./richTextEditor";

export interface JournalDetailProps {
  isDetailVisible: boolean,
  setIsDetailVisible: (state: boolean) => void,
  journal: Journal,
  onClose: () => void,
  onDelete: (journalId: number) => void,
  onEdit: (updatedJournal: Journal) => void,
}

function JournalDetailModal({ isDetailVisible, setIsDetailVisible, journal, onClose, onDelete, onEdit }: JournalDetailProps) {
  const journalDataTransform = (dataString) => {
    const parsedSections = JSON.parse(dataString);
    if (!parsedSections) {
      return [];
    }
    // Group consecutive images together into grids
    const groupedSections = [];
    let currentImageGroup = [];
    parsedSections.forEach((section, _) => {
      if (section.type === "image") {
        currentImageGroup.push(section);
      } else {
        if (currentImageGroup.length > 0) {
          groupedSections.push({
            type: "imageGrid",
            images: currentImageGroup,
          });
          currentImageGroup = [];
        }
        groupedSections.push(section);
      }
    });
    
    // Add any remaining images
    if (currentImageGroup.length > 0) {
      groupedSections.push({
        type: "imageGrid",
        images: currentImageGroup,
      });
    }
    
    return groupedSections;
  };
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalTitle, setEditedJournalTitle] = useState(journal.title);
  const [editedJournalCategory, setEditedJournalCategory] = useState(journal.category);
  const [editedJournalLocation, setEditedJournalLocation] = useState(journal.loc);
  const [editedJournalCondition, setEditedJournalCondition] = useState(journal.condition);
  const [editedInitDate, setEditedInitDate] = useState(new Date(new Date(journal?.initDate).setHours(0, 0, 0, 0)));
  const [editedEndDate, setEditedEndDate] = useState(new Date(new Date(journal?.endDate).setHours(0, 0, 0, 0)));
  const [sections, setSections] = useState(() => {
	  journalDataTransform(journal.captionText);
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (editedJournalTitle && editedJournalLocation && editedJournalCondition && editedInitDate && editedEndDate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [editedJournalTitle, editedJournalLocation, editedJournalCondition, editedInitDate, editedEndDate]);

  useEffect(() => {
    setSections(journalDataTransform(journal.captionText));
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

                <RichTextEditor onContentChange={(newSections) => {
                  setSections(newSections);
                  console.log(newSections, "newSections");
                }} initialContent={journal.captionText} />

                <View style={styles.buttonContainer}>
                  <Button title="Save" onPress={handleEditSubmit} disabled={!isFormValid} color="#4CAF50" />
                  <Button title="Cancel" onPress={() => setIsEditMode(false)} color="#f44336" />
                </View>
              </View>
            ) : (
              <JournalDisplay journal={journal} groupedSections={sections} />
            )}
          </View>
        </View>       
      </ScrollView>
    </Modal>
  );
};

export default JournalDetailModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#555",
  },
  detailText: {
    fontWeight: "normal",
    color: "#444",
  },
  datePicker: {
    width: "100%",
    marginBottom: 15,
  },
  textArea: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  blogContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    width: 100,
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  journalBody: {
    fontSize: 16,
    marginTop: 8,
    color: "#555",
  },
  dropdownContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  dropdown: {
    height: 40,
    width: "100%",
  },
  sectionContainer: {
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  scrollView: {
    maxHeight: "80%",
  },
  deleteButton: {
    marginLeft: 10,
  },
});
