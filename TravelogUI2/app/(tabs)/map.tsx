import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';

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

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhzaGFvIiwiYSI6ImNtMmN0cDV4dzE1ZXcybHE0aHZncWkybzYifQ.fRl3Y5un5jRiop-3EZrJCg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current ? mapContainerRef.current : '',
      center: center,
      zoom: zoom,
    });

    mapRef.current.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current ? mapRef.current.getCenter() : {lng: -122.06258247708297, lat: 37.0003006998805}
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


  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className='reset-button' onClick={handleButtonClick}>
        Reset
      </button>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}



export default function map() {
  return (
    <Map />
  )
}