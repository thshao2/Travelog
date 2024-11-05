import React from 'react';
import { useEffect, useState } from 'react';
import { Text, View, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { DatePickerInput } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import { useLoginContext } from './context/LoginContext';

import config from './config';

const {API_URL} = config;

interface JournalModalProps {
  selectedPin: {
    pinId: number | null,
    marker: mapboxgl.Marker | null;
    position: {
        top: number;
        left: number;
    } | null;
  },
  isModalVisible: boolean,
  setIsModalVisible: (state: boolean) => void,
  onSubmitJournal: () => void,
}

function JournalModal({selectedPin, isModalVisible, setIsModalVisible, onSubmitJournal}: JournalModalProps){
    const loginContext = useLoginContext();
    const token = loginContext.accessToken;
    // State for managing the modal and form data
    // const [isModalVisible, setIsModalVisible] = useState(false);
    const [journalTitle, setJournalTitle] = useState('');
    const [journalCategory, setJournalCategory] = useState('');
    const [journalLocation, setJournalLocation] = useState('');
    const [condition, setCondition] = useState('Visited');
    const [initDate, setInitDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [journalBody, setJournalBody] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
      if (journalTitle && journalLocation && condition && initDate && endDate) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }, [journalTitle, journalLocation, condition, initDate, endDate]);

    const handleSubmit = async () => {
      console.log("Submitting journal...", journalTitle, journalLocation, condition, journalCategory, initDate, endDate, journalBody);
      
      try {
          const memoryData = {
              pinId: selectedPin.pinId,
              title: journalTitle,
              category: journalCategory,
              loc: journalLocation,
              condition: condition,
              captionText: journalBody,
              initDate: initDate,
              endDate: endDate,
              mediaIds: [1, 2, 3],  // Replace with actual media IDs
          };
          
          let response = await fetch(`${API_URL}/travel/memory`, {
              method: 'POST',
              body: JSON.stringify(memoryData),
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
          });
  
          if (response.ok) {
              const data = await response.json();
              console.log("API Response: ", data);
              // Reset the journal form
              setJournalTitle('');
              setJournalCategory('');
              setJournalLocation('');
              setCondition('Visited');
              setInitDate(new Date());
              setEndDate(new Date());
              setJournalBody('');
              setIsModalVisible(false)
              onSubmitJournal();
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
          <Text style={styles.modalTitle}>New Journal</Text>

          {/* Title input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Title*</Text>
                <TextInput
            style={styles.input}
            placeholder="Enter title..."
            value={journalTitle}
            onChangeText={setJournalTitle}
          />
          </View>

          {/* Category input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <TextInput
            style={styles.input}
            placeholder="Enter category..."
            value={journalCategory}
            onChangeText={setJournalCategory}
          />
          </View>

          {/* Location input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Location*</Text>
                <TextInput
            style={styles.input}
            placeholder="Enter location..."
            value={journalLocation}
            onChangeText={setJournalLocation}
          />
          </View>

          {/* Status dropdown */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Status*</Text>
                <View style={styles.dropdownContainer}>
                    <Picker
                        selectedValue={condition}
                        onValueChange={(itemValue: any) => setCondition(itemValue)}
                        style={styles.dropdown}
                    >
                        <Picker.Item label="Visited" value="Visited" />
                        <Picker.Item label="Planned" value="Planned" />
                    </Picker>
                </View>
          </View>

          {/* Start Date input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Start Date*</Text>
                <DatePickerInput
            locale="en"
            label="Enter start date..."
            value={initDate}
            onChange={(d: any) => setInitDate(d)}
            inputMode="start"
            mode="outlined"
            style={styles.datePicker}
          />
          </View>
          
          
          {/* End Date input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>End Date*</Text>
                <DatePickerInput
            locale="en"
            label="Enter end date..."
            value={endDate}
            onChange={(d: any) => setEndDate(d)}
            inputMode="start"
            mode="outlined"
            style={styles.datePicker}
          />
          </View>
          

          {/* Journal body input */}
          <View style={styles.inputContainer}>
                <Text style={styles.label}>Journal</Text>
                <TextInput
            style={[styles.input, styles.journalInput]}
            placeholder="Write your journal here..."
            value={journalBody}
            onChangeText={setJournalBody}
            multiline={true}
          />
          </View>
          

          {/* Submit and cancel buttons */}
          <View style={styles.buttonContainer}>
            <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid} color="#4CAF50" />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#f44336" />
          </View>
        </View>
      </View>
    </Modal>
)};

export default JournalModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalContent: {
    marginTop: 20,
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 10,
  },
  datePicker: {
    width: '100%',
    marginBottom: 15,
  },
  journalInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 100,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
      width: 100,
      marginRight: 10,
      fontSize: 16,
      color: '#333',
  },
  input: {
      flex: 1,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      fontSize: 16,
  },
  dropdownContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
  },
  dropdown: {
      height: 40,
      width: '100%',
  },
});
