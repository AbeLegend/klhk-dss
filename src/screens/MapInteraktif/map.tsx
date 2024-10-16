"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import "@arcgis/core/assets/esri/themes/light/main.css";
import { useAppSelector } from "@/redux/store";

// local
import { cn, extractMapNumber, getPathFromUrl } from "@/lib";
import { WebServiceModel } from "@/api/types";
import { useDispatch } from "react-redux";
import { updateLayer } from "@/redux/Map/MapInteraktif/slice";

// type
interface LayerProps extends WebServiceModel {
  isActive: boolean;
  isUsed: boolean;
}

interface UsedLayerProps {
  url: string;
  id: number;
  paramUrl: string | null;
  isUsed: boolean;
}

const MapComponent: FC<{ children: ReactNode }> = ({ children }) => {
  // useRef
  const mapRef = useRef<HTMLDivElement>(null);
  // useState
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { layer } = useAppSelector((state) => state.mapInteraktif);

  // function
  const getUrlFromLayer = () => {
    if (layer.length > 0) {
      const activeLayer: LayerProps[] = layer.filter(
        (item) => item.isActive && !item.isUsed
      );
      if (activeLayer.length > 0) {
        const filteredLayer: UsedLayerProps[] = activeLayer.map((item) => {
          const path = item.Url;
          const urlFixed = getPathFromUrl(path);
          const paramUrl = extractMapNumber(urlFixed);
          return {
            id: item.Id,
            url: urlFixed,
            paramUrl: paramUrl,
            isUsed: item.isUsed,
          };
        });
        fetchLayerInfo(filteredLayer);
      }
    }
  };
  const fetchLayerInfo = async (data: UsedLayerProps[]) => {
    try {
      if (data.length > 0) {
        for (const item of data) {
          const { id, isUsed, paramUrl, url } = item;

          if (!isUsed) {
            // console.log("position", url);
            if (paramUrl === null) {
              const response = await fetch(`/klhk-dss${url}?f=json`);
              const data = await response.json();

              if (data.layers) {
                // console.log("Jumlah layer:", data.layers.length);
                // console.log("URL fetched:", url);
                // RENDER SEMUA LAYER DISINI
              }
            } else {
              // RENDER 1 LAYER DISINI
            }
          }
          item.isUsed = true;
          dispatch(
            updateLayer({
              id: item.id,
              updatedData: {
                isActive: true,
                isUsed: true,
              },
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching layer info:", error);
    }
  };

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

  useEffect(() => {
    getUrlFromLayer();
  }, [layer]);

  return (
    <div ref={mapRef} className={cn(["h-screen w-full"])}>
      {isMapLoaded && children}
    </div>
  );
};

export default MapComponent;
