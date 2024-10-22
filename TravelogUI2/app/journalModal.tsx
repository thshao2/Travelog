import React from 'react';
import { useEffect, useState } from 'react';
import { View, TextInput, Button, Modal, Text, StyleSheet } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

function JournalModal({isModalVisible, setIsModalVisible}){
    // State for managing the modal and form data
    // const [isModalVisible, setIsModalVisible] = useState(false);
    const [journalTitle, setJournalTitle] = useState('');
    const [journalCategory, setJournalCategory] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [journalBody, setJournalBody] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
      if (journalCategory && fromDate) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }, [journalCategory, fromDate]);

    const handleSubmit = () => {
      // Handle form submission here
      console.log("Submitting journal...", journalTitle, journalCategory, fromDate, toDate, journalBody);
      setIsModalVisible(false);
      setJournalTitle('');
      setJournalCategory('');
      setFromDate(new Date());
      setToDate(new Date());
      setJournalBody('');
    };

return (
  <Modal
    visible={isModalVisible}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setIsModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>New Journal</Text>
        
        {/* Title input */}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={journalTitle}
          onChangeText={setJournalTitle}
        />

        {/* Category input */}
        <TextInput
          style={styles.input}
          placeholder="Category (Required)"
          value={journalCategory}
          onChangeText={setJournalCategory}
        />

        {/* From Date input */}
        <DatePickerInput
          locale="en"
          label="From Date"
          value={fromDate}
          onChange={(d: any) => setFromDate(d)}
          inputMode="start"
          mode="outlined"
          style={styles.datePicker}
        />

        {/* To Date input */}
        <DatePickerInput
          locale="en"
          label="To Date"
          value={toDate}
          onChange={(d: any) => setToDate(d)}
          inputMode="start"
          mode="outlined"
          style={styles.datePicker}
        />

        {/* Journal body input */}
        <TextInput
          style={[styles.input, styles.journalInput]}
          placeholder="Write your journal here..."
          value={journalBody}
          onChangeText={setJournalBody}
          multiline={true}
        />

        {/* Submit and cancel buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </View>
    </View>
  </Modal>
)};

export default JournalModal;


const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
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
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    journalInput: {
      height: 100,
      verticalAlign: 'top',
    },
    datePicker: {
      marginBottom: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });