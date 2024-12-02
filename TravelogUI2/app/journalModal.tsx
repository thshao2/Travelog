import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, Modal, ScrollView } from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { Picker } from "@react-native-picker/picker";
import { useLoginContext } from "./context/LoginContext";
import RichTextEditor from "./richTextEditor";
import config from "./config";

import { updateUserStats } from "./utils/journalUtil";
import { styles } from "./styles/journal-modal-styles";

const { API_URL } = config;

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

function JournalModal({ selectedPin, isModalVisible, setIsModalVisible, onSubmitJournal }: JournalModalProps) {
  const loginContext = useLoginContext();
  const [journalTitle, setJournalTitle] = useState("");
  const [journalCategory, setJournalCategory] = useState("");
  const [journalLocation, setJournalLocation] = useState("");
  const [condition, setCondition] = useState("Visited");
  const [initDate, setInitDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sections, setSections] = useState([{ type: "text", content: "" }]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [reset, setReset] = useState("");
  useEffect(() => {
    if (journalTitle && journalLocation && condition && initDate && endDate) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [journalTitle, journalLocation, condition, initDate, endDate]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (selectedPin?.pinId) {
        try {
          const coordinates = await getSelectedPinCoordinates(selectedPin.pinId, loginContext.accessToken);
          if (coordinates) {
            getDefaultLocation(coordinates.latitude, coordinates.longitude, loginContext.accessToken);
          }
        } catch (err) {
          console.error("Error fetching coordinates:", err);
        }
      }
    };
    fetchCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPin]);

  const handleSubmit = async () => {
    console.log("very sad");
    console.log(sections);
    try {
      const memoryData = {
        pinId: selectedPin.pinId,
        title: journalTitle,
        category: journalCategory,
        loc: journalLocation,
        condition: condition,
        captionText: JSON.stringify(sections),
        initDate: initDate,
        endDate: endDate,
        mediaIds: [1, 2, 3], // Replace with actual media IDs
      };

      let response = await fetch(`${API_URL}/travel/memory`, {
        method: "POST",
        body: JSON.stringify(memoryData),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response: ", data);
        setIsModalVisible(false);
        onSubmitJournal();
        if (condition === "Visited") {
          updateUserStats(loginContext.accessToken);
        }
      } else {
        console.error("Failed to fetch from travel-service. Status: ", response.body);
      }
    } catch (error) {
      console.error("Error calling travel-service: ", error);
    }
    clearForm();
  };

  const clearForm = () => {
    setJournalTitle("");
    setJournalCategory("");
    setJournalLocation("");
    setCondition("Visited");
    setInitDate(new Date());
    setEndDate(new Date());
    setSections([{ type: "text", content: "" }]);
    setReset("");
  };

  // const updateUserStats = async (token: string) => {
  //   try {
  //     const response = await fetch(`${API_URL}/travel/memory/update-stats`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("updateUserStats - network response was not ok");
  //     }
  //   } catch (err) {
  //     console.error("Error updating stats after posting pin to database: " + err);
  //   }
  // };

  const getDefaultLocation = async (latitude: number, longitude: number, token: string) => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/default-loc?latitude=${latitude}&longitude=${longitude}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("journalModal -- error getting default location");
      }

      const data = await response.json();
      const defaultLocation = data.defaultLocation;
      setJournalLocation(defaultLocation);
    } catch (err) {
      console.error("Error fetching default location for journal: " + err);
    }
  };

  const getSelectedPinCoordinates = async (pinId: number, token: string) => {
    try {
      const response = await fetch(`${API_URL}/travel/pin/get-coordinates/${pinId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("journalModal -- error getting pin coordinates");
      }
      const data = await response.json();
      const latitude = data[0];
      const longitude = data[1];
      return { latitude, longitude };
    } catch (err) {
      console.error("Error fetching coordinates of pin: " + err);
      return null;
    }
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
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

            {/* Rich Text Editor */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Journal</Text>
              <View style={{ flex: 1 }}>
                <RichTextEditor
                  onContentChange={(newSections) => {
                    setSections(newSections);
                    console.log(newSections, "newSections");
                  }
                  } initialContent={reset}
                />
              </View>
            </View>

            {/* Submit and cancel buttons */}
            <View style={styles.buttonContainer}>
              <Button title="Submit" onPress={handleSubmit} disabled={!isFormValid} color="#4CAF50" />
              <Button title="Cancel" onPress={() => {
                setIsModalVisible(false);
                clearForm();
              }} color="#f44336" />
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

export default JournalModal;