declare module '@mapbox/mapbox-gl-geocoder' {
    import { Map } from 'mapbox-gl';
  
    interface GeocoderOptions {
      accessToken: string;
      mapboxgl: any;
      placeholder?: string;
      [key: string]: any;
    }
  
    class MapboxGeocoder {
      constructor(options: GeocoderOptions);
      addTo(map: Map): this;
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
    }
  
    export default MapboxGeocoder;
  }
  