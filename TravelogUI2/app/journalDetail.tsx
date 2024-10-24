import React, { useState } from 'react';
import { View, TextInput, Button, Modal, Text, StyleSheet } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

function JournalDetailModal({ isVisible, setIsVisible, journal, onDelete, onEdit, onClose }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalTitle, setEditedJournalTitle] = useState(journal.title);
  const [editedJournalCategory, setEditedJournalCategory] = useState(journal.category);
  const [editedFromDate, setEditedFromDate] = useState(new Date(journal.fromDate));
  const [editedToDate, setEditedToDate] = useState(new Date(journal.toDate));
  const [editedJournalBody, setEditedJournalBody] = useState(journal.body);

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleEditSubmit = () => {
    onEdit({
      ...journal,
      title: editedJournalTitle,
      category: editedJournalCategory,
      fromDate: editedFromDate,
      toDate: editedToDate,
      body: editedJournalBody,
    });
    setIsEditMode(false);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsVisible(false)}
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
              <DatePickerInput
                locale="en"
                label="From Date"
                value={editedFromDate}
                onChange={(d: any) => setEditedFromDate(d)}
                inputMode="start"
                mode="outlined"
                style={styles.datePicker}
              />
              <DatePickerInput
                locale="en"
                label="To Date"
                value={editedToDate}
                onChange={(d: any) => setEditedToDate(d)}
                inputMode="start"
                mode="outlined"
                style={styles.datePicker}
              />
              <TextInput
                style={[styles.input, styles.journalInput]}
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
              <Text style={styles.label}>From: {journal.createdAt}</Text>
              <Text style={styles.label}>To: {journal.toDate}</Text>
              <Text style={styles.label}>Details:</Text>
              <Text style={styles.journalBody}>{journal.captionText}</Text>

              <View style={styles.buttonContainer}>
                {/* <Button title="Edit" onPress={handleEditToggle} />
                <Button title="Delete" onPress={() => onDelete(journal.id)} /> */}
                <Button title="Close" onPress={() => setIsVisible(false)} />
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