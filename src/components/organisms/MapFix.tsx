"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import "@arcgis/core/assets/esri/themes/light/main.css";

// local
import { cn } from "@/lib";

const MapComponent: FC<{ children: ReactNode }> = ({ children }) => {
  // useRef
  const mapRef = useRef<HTMLDivElement>(null);
  // useState
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (mapRef.current) {
      const webMap = new WebMap({
        basemap: "topo-vector",
        // portalItem: {
        //   id: "8d91bd39e873417ea21673e0fee87604",
        // },
      });
      const view = new MapView({
        container: mapRef.current,
        map: webMap,
        center: [120.0, 0.0],
        zoom: 5,
      });

      // Menghapus kontrol zoom default
      view.ui.remove("zoom");

      // Menangani event ketika peta berhasil dimuat
      view
        .when(() => {
          console.log("Map loaded successfully!");
          setIsMapLoaded(true);
        })
        .catch((error) => {
          console.error("Error loading the map:", error);
        });

      // Cleanup saat komponen unmount
      return () => {
        if (view) {
          view.destroy();
        }
      };
    }
  }, []);

  return (
    <div ref={mapRef} className={cn(["h-screen w-full"])}>
      {isMapLoaded && children}
    </div>
  );
};

export default MapComponent;
