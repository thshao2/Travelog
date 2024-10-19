import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap, Marker} from 'mapbox-gl';
import { Platform, Text, TouchableOpacity, StyleSheet } from 'react-native'

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

      // Store the marker
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      // Exit pin drop mode after adding the marker
      setAddingPin(false);
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

      {/* Plus button for dropping a pin */}
      <TouchableOpacity style={styles.plusButton} onPress={handlePinDropMode}>
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>
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
});

export default function map() {
  return (
    <Map />
  )
}