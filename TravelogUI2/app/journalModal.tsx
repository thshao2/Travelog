import React from 'react';
import { useEffect, useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';

interface JournalModalProps {
  isModalVisible: boolean,
  setIsModalVisible: (state: boolean) => void,
}

function JournalModal({isModalVisible, setIsModalVisible}: JournalModalProps){
    // State for managing the modal and form data
    // const [isModalVisible, setIsModalVisible] = useState(false);
    const [journalTitle, setJournalTitle] = useState('');
    const [journalCategory, setJournalCategory] = useState('');
    const [journalLocation, setJournalLocation] = useState('');
    const [initDate, setInitDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [journalBody, setJournalBody] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
      if (journalCategory && initDate) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }, [journalCategory, initDate]);

    const handleSubmit = async () => {
      const token = localStorage.getItem('token');
      console.log("Submitting journal...", journalTitle, journalLocation, journalCategory, initDate, endDate, journalBody);
      
      try {
        const memoryData = {
          userId: 1,  // Replace with actual user ID
          pinId: 9999,  // Replace with actual pin ID
          title: journalTitle,
          category: journalCategory,
          loc: journalLocation,
          captionText: journalBody,
          initDate: initDate.toISOString(),
          endDate: endDate.toISOString(),
          mediaIds: [1, 2, 3],  // Replace with actual media IDs
        };
        let response = await fetch(`http://localhost:8080/travel/memory`, {
            method: 'POST',
            body: JSON.stringify(memoryData),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
        });
        // response = await response.json();
        console.log(response)
        if (response.ok) {
            const data = await response.json();
            console.log("API Response: ", data);
            // Reset the journal form
            setJournalTitle('');
            setJournalCategory('');
            setJournalLocation('');
            setInitDate(new Date());
            setEndDate(new Date());
            setJournalBody('');
        } else {
            console.error("Failed to fetch from travel-service. Status: ", response.status);
        }
    } catch (error) {
        console.error("Error calling travel-service: ", error);
    }
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

        {/* Location input */}
        {/* Default to the closest place (user will be able to modify if they want) */}
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={journalLocation}
          onChangeText={setJournalLocation}
        />

        {/* Start Date input (default: current date) */}
        <DatePickerInput
          locale="en"
          label="Start Date"
          value={initDate}
          onChange={(d: any) => setInitDate(d)}
          inputMode="start"
          mode="outlined"
          style={styles.datePicker}
        />

        {/* End Date input (default: current date) */}
        <DatePickerInput
          locale="en"
          label="End Date"
          value={endDate}
          onChange={(d: any) => setEndDate(d)}
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