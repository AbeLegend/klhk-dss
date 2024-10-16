"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
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
  const [view, setView] = useState<MapView | null>(null);
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

          if (!isUsed && view) {
            if (paramUrl === null) {
              // Fetching the details of all layers if no specific paramUrl is defined
              const response = await fetch(`/klhk-dss${url}?f=json`);
              const data = await response.json();

              if (data.layers) {
                // Iterate over the available layers and add them to the map
                data.layers.forEach((layerInfo: any) => {
                  const featureLayer = new FeatureLayer({
                    url: `/klhk-dss${url}/${layerInfo.id}`,
                  });
                  view.map.add(featureLayer);
                  console.log(`Layer added: ${url}/${layerInfo.id}`);
                });
              }
            } else {
              // Add a specific layer using the paramUrl
              const featureLayer = new FeatureLayer({
                url: `/klhk-dss${url}`,
              });
              view.map.add(featureLayer);
              console.log(`Single layer added: ${url}`);
            }

            // Mark the layer as used
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
      }
    } catch (error) {
      console.error("Error fetching layer info:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      const webMap = new WebMap({
        basemap: "topo-vector",
      });
      const mapView = new MapView({
        container: mapRef.current,
        map: webMap,
        center: [120.0, 0.0],
        zoom: 5,
      });

      // Remove default zoom controls
      mapView.ui.remove("zoom");

      // Handle the event when the map is loaded
      mapView
        .when(() => {
          console.log("Map loaded successfully!");
          setIsMapLoaded(true);
          setView(mapView);
        })
        .catch((error) => {
          console.error("Error loading the map:", error);
        });

      // Cleanup when the component unmounts
      return () => {
        if (mapView) {
          mapView.destroy();
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
