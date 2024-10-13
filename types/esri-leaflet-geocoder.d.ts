// types/esri-leaflet-geocoder.d.ts
declare module 'esri-leaflet-geocoder' {
  import * as L from 'leaflet';

  export interface Feature {
    latlng: L.LatLng;
    properties: any;
    text: string;
    type: string;
  }

  export interface GeocodeService {
    geocode(): GeocodeBuilder;
  }

  export interface GeocodeBuilder {
    text(query: string): GeocodeBuilder;
    run(callback: (error: any, results: { results: Feature[] }) => void): void;
  }

  export function geocodeService(): GeocodeService;
  export function geosearch(options?: any): L.Control;
}
