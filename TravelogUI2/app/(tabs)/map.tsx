import { useRef, useEffect, useState } from "react";
import mapboxgl, { Map as MapboxMap, Marker } from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { Platform, Text, Pressable, StyleSheet } from "react-native";
import JournalModal from "../journalModal";
import PopupMenu from "../popupMenu";
import config from "../config";
import { useLoginContext } from "../context/LoginContext";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import "./Map.css";
import { Double } from "react-native/Libraries/Types/CodegenTypes";

const { API_URL } = config;

const INITIAL_CENTER: [number, number] = [
  -122.0626,
  37.0003,
];
const INITIAL_ZOOM = 17.08;

const INITIAL_PITCH = 75;

export type Journal = {
  id: number;
  userId: number;
  pinId: number;
  title: string;
  category: string;
  loc: string;
  condition: string,
  captionText: string;
  initDate: Date;
  endDate: Date;
}

function Map() {
  const loginContext = useLoginContext();

  const mapRef = useRef<MapboxMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // type for HTML div element

  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [pitch, setPitch] = useState<number>(INITIAL_PITCH);

  const [addingPin, setAddingPin] = useState(false); // Track pin addition mode
  // const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]); // Store markers
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Managing seleted pin for pop up menu
  const [selectedPin, setSelectedPin] = useState<{ pinId: number | null, marker: mapboxgl.Marker | null, position: { top: number, left: number } | null }>({
    pinId: null,
    marker: null,
    position: null,
  });

  // Managing modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [memories, setMemories] = useState<Journal[]>([]);

  const fetchMemories = async (pinId: number | null) => {
    if (!pinId) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/travel/memory/${pinId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const memoriesData = await response.json();
      setMemories(memoriesData);
    } catch (err) {
      console.error("Failed to fetch memories:", err);
    }
  };

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoidGhzaGFvIiwiYSI6ImNtMmN0cDV4dzE1ZXcybHE0aHZncWkybzYifQ.fRl3Y5un5jRiop-3EZrJCg";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current ? mapContainerRef.current : "",
      center: center,
      zoom: zoom,
      pitch: pitch,
      config: {
        basemap: {
          show3dObjects: true,
        },
      },
    });

    // Initialize and add the Mapbox Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for places",
    });

    mapRef.current.addControl(geocoder);

    // Listen for the geocoder result event
    // geocoder.on('result', () => {
    //   // Set the pitch to 75 after moving to the new location
    //   mapRef.current?.setPitch(75);
    // });

    mapRef.current.on("move", () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current ? mapRef.current.getCenter() : { lng: -122.06258247708297, lat: 37.0003006998805 };
      const mapZoom = mapRef.current ? mapRef.current.getZoom() : 18.12;

      // update state
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
      // mapRef.current?.setPitch(75);
      setPitch(75);
      // mapRef.current?.flyTo({
      //   center: center,
      //   zoom: zoom,
      //   pitch: 75,
      // })
      // mapRef.current?.setPitch(INITIAL_PITCH);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  const fetchPins = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/travel/pin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const pins = await response.json();
      console.log(pins);

      pins.forEach((pin: any) => {
        const { latitude, longitude } = pin.location;
        if (mapRef.current) {
          const newMarker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
          newMarker.getElement().addEventListener("click", () => handlePinClick(newMarker, pin.id));
          markersRef.current.push(newMarker);
        }
      });
      console.log("after fetching pin, mapRef =", mapRef);
    } catch (err) {
      console.error("Error fetching pins:", err);
    }
  };

  const postPinToDb = async(token: string | null, longitude: Double, latitude: Double) => {
    try {
      console.log("Authorization token is " + token);
      const response = await fetch(`${API_URL}/travel/pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const pin = await response.json();
      return pin;
    } catch (err) {
      console.error("Error posting pin to database: " + err);
    }
  };

  // const updateUserStats = async(token: string) => {
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
  //     } else {
  //       console.log("User stats updated successfully !!!");
  //     }
  //   } catch (err) {
  //     console.error("Error updating stats after posting pin to database: " + err);
  //   }
  // };

  const handleButtonClick = () => {
    mapRef.current?.flyTo({
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
  };

  const handlePinDropMode = () => {
    setAddingPin(!addingPin); // Toggle pin drop mode
  };

  const handleMapClick = async(e: mapboxgl.MapMouseEvent) => {
    if (addingPin && mapRef.current) {
      const { lng, lat } = e.lngLat;

      // Create a new marker and add it to the map
      const newMarker = new Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      // Update database with the new pin
      console.log("About to post pin, token is", loginContext.accessToken);
      const token = loginContext.accessToken;
      const newPin = await postPinToDb(token, lng, lat);
      // await updateUserStats(token);
      console.log("newPin is", newPin);

      // Add event listener for pin & set pin ID
      newMarker.getElement().addEventListener("click", () => handlePinClick(newMarker, newPin.id)); // need the actual pinId

      // Store the marker
      // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      markersRef.current.push(newMarker);

      // Exit pin drop mode after adding the marker
      setAddingPin(false);
    }
  };

  const handlePinClick = (marker: mapboxgl.Marker, pinId: number) => {
    const lngLat = marker.getLngLat();
    const point = mapRef.current?.project([lngLat.lng, lngLat.lat]); // Get pixel position of the marker
    const mapContainerBounds = mapContainerRef.current?.getBoundingClientRect(); // Get map container dimensions

    if (point && mapContainerBounds) {
      let top = point.y - 20;
      let left = point.x + 10;

      // Check if popup goes off the right side of the screen
      if (left + 250 > mapContainerBounds.width) {
        left = point.x - 250;
      }

      // Check if popup goes off the bottom of the screen
      if (top + 180 > mapContainerBounds.height) {
        top = point.y - 200;
      }

      setSelectedPin({
        pinId,
        marker,
        position: {
          top: top,
          left: left,
        },
      });

      // Update popup position when the map moves
      mapRef.current?.on("move", () => {
        const updatedPoint = mapRef.current?.project([lngLat.lng, lngLat.lat]);

        if (updatedPoint) {
          let updatedTop = updatedPoint.y - 20;
          let updatedLeft = updatedPoint.x + 10;

          if (updatedLeft + 250 > mapContainerBounds.width) {
            updatedLeft = updatedPoint.x - 250;
          }

          if (updatedTop + 180 > mapContainerBounds.height) {
            updatedTop = updatedPoint.y - 200;
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

  const handleDeletePin = async(token: string) => {
    console.log("handleDeletePin called in map.tsx");
    try {
      // Make API call to delete the pin
      const response = await fetch(`${API_URL}/travel/pin/${selectedPin.pinId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete pin.");
      }

      // Remove pin from local state
      selectedPin.marker!.remove();
      markersRef.current = markersRef.current.filter(pinMarker => pinMarker !== selectedPin.marker);
      setSelectedPin({ pinId: null, marker: null, position: null });
      console.log("Pin deleted successfully.");
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  useEffect(() => {
    console.log("Use effect called in map - loginContext changed, refetching the pins. markersRef is currently", markersRef.current);
    markersRef.current.forEach(marker => {
      const removed = marker.remove();
      console.log("Removing", removed);
    });
    markersRef.current = [];

    fetchPins(loginContext.accessToken);
  }, [loginContext]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.on("click", handleMapClick);
    }

    return () => {
      mapRef.current?.off("click", handleMapClick);
    };
  }, [addingPin]);

  return (
    <>
      {Platform.OS === "web" ? (
        <div className="sidebar">
          Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)} | zIndex: {mapRef.current?.getPitch()}
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

      {/* 
      PopupMenu ->  
        JournalDetail
        PopupMenuList
      
      JournalModal
      */}
      {selectedPin?.marker && selectedPin.position && (
        <PopupMenu
          selectedPin={selectedPin}
          onClose={() => setSelectedPin({ pinId: null, marker: null, position: null })}
          onAddJournal={() => setIsModalVisible(true)}
          onDeletePin={async () => handleDeletePin(loginContext.accessToken)}
          key={memories.length}
        />
      )}

      <JournalModal
        selectedPin={selectedPin}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onSubmitJournal={() => {
          fetchMemories(selectedPin.pinId ? selectedPin.pinId : null);
          setIsModalVisible(false);
        }}
      />

      {/* Plus button for dropping a pin */}
      {loginContext.accessToken.length > 0 && (
        <Pressable style={styles.plusButton} onPress={handlePinDropMode}>
          <Text style={styles.plusButtonText}>+</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures the button stays on top of the map
  },
  plusButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default function map() {
  return (
    <Map />
  );
}