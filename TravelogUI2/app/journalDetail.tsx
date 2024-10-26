import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, Text, StyleSheet } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { GestureResponderEvent } from 'react-native';
import { Journal } from './popupMenu';

export interface JournalDetailProps {
  isDetailVisible: boolean,
  setIsDetailVisible: (state: boolean) => void,
  journal: Journal,
  onClose: () => void,
  onDelete: (journalId: number) => void,
  onEdit: (updatedJournal: Journal) => void,
}

function JournalDetailModal({ isDetailVisible, setIsDetailVisible, journal, onClose, onDelete, onEdit }: JournalDetailProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalTitle, setEditedJournalTitle] = useState(journal.title);
  const [editedJournalCategory, setEditedJournalCategory] = useState(journal.category);
  const [editedJournalLocation, setEditedJournalLocation] = useState(journal.loc);
  const [editedInitDate, setEditedInitDate] = useState(new Date(journal?.initDate || new Date()));
  const [editedEndDate, setEditedEndDate] = useState(new Date(journal?.endDate || new Date()));
  const [editedJournalBody, setEditedJournalBody] = useState(journal.captionText);

  useEffect(() => {
    if (journal) {
      setEditedJournalTitle(journal.title);
      setEditedJournalCategory(journal.category);
      setEditedJournalLocation(journal.loc)
      setEditedInitDate(new Date(journal.initDate));
      setEditedEndDate(new Date(journal.endDate));
      setEditedJournalBody(journal.captionText);
    }
  }, [journal]);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditSubmit = () => {
    onEdit({
      ...journal,
      title: editedJournalTitle,
      category: editedJournalCategory,
      loc: editedJournalLocation,
      initDate: editedInitDate,
      endDate: editedEndDate,
      captionText: editedJournalBody,
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isEditMode ? (
            <>
              <Text style={styles.modalTitle}>Edit Journal</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={editedJournalTitle}
                onChangeText={setEditedJournalTitle}
              />

              <TextInput
                style={styles.input}
                placeholder="Category (Required)"
                value={editedJournalCategory}
                onChangeText={setEditedJournalCategory}
              />

              <TextInput
                style={styles.input}
                placeholder="Location"
                value={editedJournalLocation}
                onChangeText={setEditedJournalLocation}
                />

              <DatePickerInput
                locale="en"
                label="Start Date"
                value={editedInitDate}
                onChange={(d: any) => setEditedInitDate(d)}
                inputMode="start"
                mode="outlined"
                style={styles.datePicker}
              />

              <DatePickerInput
                locale="en"
                label="Emd Date"
                value={editedEndDate}
                onChange={(d: any) => setEditedEndDate(d)}
                inputMode="start"
                mode="outlined"
                style={styles.datePicker}
              />

              <TextInput
                style={[styles.input]}
                placeholder="Write your journal here..."
                value={editedJournalBody}
                onChangeText={setEditedJournalBody}
                multiline={true}
              />

              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handleEditSubmit} />
                <Button title="Cancel" onPress={() => setIsEditMode(false)} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>{journal.title}</Text>
              <Text style={styles.label}>Category: {journal.category}</Text>
              <Text style={styles.label}>Location: {journal.loc}</Text>
              <Text style={styles.label}>Start Date: {journal.initDate.toLocaleDateString()}</Text>
              <Text style={styles.label}>End Date: {journal.endDate.toLocaleDateString()}</Text>
              <Text style={styles.label}>Journal:</Text>
              <Text style={styles.journalBody}>{journal.captionText}</Text>

              <View style={styles.buttonContainer}>
                <Button title="Edit" onPress={handleEditToggle} />
                <Button title="Delete" onPress={() => onDelete(journal.id)} />
                <Button title="Close" onPress={onClose} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default JournalDetailModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePicker: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  journalBody: {
    fontSize: 14,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});