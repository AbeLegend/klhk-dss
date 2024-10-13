"use client";
// components/MapWithGeocoding.tsx
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import L, { Map as LeafletMap } from "leaflet";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";

// Import esri-leaflet-geocoder
import * as ELG from "esri-leaflet-geocoder";

// Dynamically import React Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const MapWithGeocoding: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]); // Default position
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<ELG.Feature[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Geocoding
    const geocoder = ELG.geocodeService();

    // Add Geocoding Control to the map
    const searchControl = ELG.geosearch().addTo(mapRef.current);

    // Cast searchControl to any to bypass the error
    (searchControl as any).on("results", (data: { results: ELG.Feature[] }) => {
      if (data.results.length > 0) {
        const feature = data.results[0];
        setPosition([feature.latlng.lat, feature.latlng.lng]);
        mapRef.current?.setView([feature.latlng.lat, feature.latlng.lng], 13);
      }
    });

    return () => {
      searchControl.remove();
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const geocoder = ELG.geocodeService();
    geocoder
      .geocode()
      .text(query)
      .run((error: any, results: { results: ELG.Feature[] }) => {
        if (error) {
          console.error("Geocoding error:", error);
          return;
        }
        if (results.results.length > 0) {
          const feature = results.results[0];
          setPosition([feature.latlng.lat, feature.latlng.lng]);
          mapRef.current?.setView([feature.latlng.lat, feature.latlng.lng], 13);
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari lokasi..."
          style={{ padding: "8px", width: "300px" }}
        />
        <button
          type="submit"
          style={{ padding: "8px 12px", marginLeft: "5px" }}
        >
          Cari
        </button>
      </form>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        ref={(mapInstance: LeafletMap) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          <Popup>{query || "Lokasi Saat Ini"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWithGeocoding;
