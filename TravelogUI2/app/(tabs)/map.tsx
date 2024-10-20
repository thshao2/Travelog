import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, Marker} from 'mapbox-gl';
import { Platform, Text, Pressable, StyleSheet, View, Modal, TextInput, Button } from 'react-native'

import 'mapbox-gl/dist/mapbox-gl.css';

import './Map.css';

const INITIAL_CENTER: [number, number] = [
  -122.0626,
  37.0003
]
const INITIAL_ZOOM = 18.12

function Map() {

  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // type for HTML div element

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const [addingPin, setAddingPin] = useState(false); // Track pin addition mode
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]); // Store markers

  const [selectedPin, setSelectedPin] = useState<{ marker: mapboxgl.Marker | null, position: { top: number, left: number } | null }>({
    marker: null,
    position: null,
  });

  // State for managing the modal and form data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [journalTitle, setJournalTitle] = useState('');
  const [journalCategory, setJournalCategory] = useState('');
  const [journalDate, setJournalDate] = useState('');
  const [journalBody, setJournalBody] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Category field is mandatory to submit the form (for categorize pins and create list)
  // All pins will be auto put in "all" list by default
  useEffect(() => {
    if (journalCategory) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [journalCategory]);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhzaGFvIiwiYSI6ImNtMmN0cDV4dzE1ZXcybHE0aHZncWkybzYifQ.fRl3Y5un5jRiop-3EZrJCg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current ? mapContainerRef.current : '',
      center: center,
      zoom: zoom,
    });

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current ? mapRef.current.getCenter() : { lng: -122.06258247708297, lat: 37.0003006998805 }
      const mapZoom = mapRef.current ? mapRef.current.getZoom() : 18.12
      // console.log(mapRef.current?.getCenter());
      // console.log(mapRef.current?.getZoom());


      // update state
      setCenter([mapCenter.lng, mapCenter.lat])
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current?.remove();
    }
  }, [])

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    })
  }

  const handlePinDropMode = () => {
    setAddingPin(!addingPin); // Toggle pin drop mode
  };

  const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    if (addingPin && mapRef.current) {
      const { lng, lat } = e.lngLat;

      // Create a new marker and add it to the map
      const newMarker = new Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Add click event listener to the marker
      newMarker.getElement().addEventListener('click', () => handlePinClick(newMarker));

      // Store the marker
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      // Exit pin drop mode after adding the marker
      setAddingPin(false);
    }
  };

  const handlePinClick = (marker: mapboxgl.Marker) => {
    const lngLat = marker.getLngLat();
    const point = mapRef.current?.project([lngLat.lng, lngLat.lat]); // Get pixel position of the marker
    const mapContainerBounds = mapContainerRef.current?.getBoundingClientRect(); // Get map container dimensions
  
    if (point && mapContainerBounds) {
      let top = point.y - 20;
      let left = point.x + 10;
  
      // Check if popup goes off the right side of the screen
      if (left + 200 > mapContainerBounds.width) { // 200 is an estimated popup width
        left = point.x - 130; // Adjust to the left
      }
  
      // Check if popup goes off the bottom of the screen
      if (top + 100 > mapContainerBounds.height) { // 100 is an estimated popup height
        top = point.y - 120; // Adjust upward
      }
  
      setSelectedPin({
        marker,
        position: {
          top: top,
          left: left,
        },
      });
  
      // Update popup position when the map moves
      mapRef.current?.on('move', () => {
        const updatedPoint = mapRef.current?.project([lngLat.lng, lngLat.lat]);
  
        if (updatedPoint) {
          let updatedTop = updatedPoint.y - 20;
          let updatedLeft = updatedPoint.x + 10;
  
          if (updatedLeft + 200 > mapContainerBounds.width) {
            updatedLeft = updatedPoint.x - 130;
          }
  
          if (updatedTop + 100 > mapContainerBounds.height) {
            updatedTop = updatedPoint.y - 120;
          }
  
          setSelectedPin((prevPin) => ({
            ...prevPin,
            position: {
              top: updatedTop,
              left: updatedLeft,
            },
          }));
        }
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on('click', handleMapClick);
    }

    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [addingPin]);


  const openJournalModal = () => {
    setIsModalVisible(true);
  };

  const closeJournalModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {Platform.OS === 'web' ? (
        <div className="sidebar">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
      ) : (
        <div className="sidebar">
          <Text>Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}</Text>
        </div>
      )}
      <button className='reset-button' onClick={handleButtonClick}>
        <Text>Reset</Text>
      </button>
      <div id='map-container' ref={mapContainerRef} />

      {selectedPin?.marker && selectedPin.position && (
        <View
          style={[
            styles.popupMenu,
            { top: selectedPin.position.top, left: selectedPin.position.left },
          ]}
        >
          <Pressable style={styles.menuButton} onPress={openJournalModal}>
            <Text style={styles.menuButtonText}>Add Journal</Text>
          </Pressable>
          <Pressable style={styles.menuButton} onPress={() => setSelectedPin({marker: null, position: null})}>
            <Text style={styles.menuButtonText}>Close</Text>
          </Pressable>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeJournalModal}
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

            {/* Date input */}
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={journalDate}
              onChangeText={setJournalDate}
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
              <Button title="Submit" onPress={() => {
                // Handle submission logic here
                console.log("Submitting: ", journalTitle, journalCategory, journalDate, journalBody);
                closeJournalModal(); // Close modal after submission
              }}
                disabled={!isFormValid}
               />
              <Button title="Cancel" onPress={closeJournalModal} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Plus button for dropping a pin */}
      <Pressable style={styles.plusButton} onPress={handlePinDropMode}>
        <Text style={styles.plusButtonText}>+</Text>
      </Pressable>
    </>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Ensure the sidebar stays above the map
  },
  resetButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensures the button stays on top of the map
  },
  plusButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  popupMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1, // Ensure it's on top of other components
  },
  popupText: {
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuButtonText: {
    color: 'white',
    textAlign: 'center',
  },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default function map() {
  return (
    <Map />
  )
}