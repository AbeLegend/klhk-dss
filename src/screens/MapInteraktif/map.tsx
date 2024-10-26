"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import Search from "@arcgis/core/widgets/Search";

import "@arcgis/core/assets/esri/themes/light/main.css";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

// local
import { cn, getPathFromUrl } from "@/lib";
import {
  setIsOpenModalMap,
  setLocation,
} from "@/redux/Map/MapInteraktif/slice";

// type

const MapComponent: FC<{
  children: ReactNode;
  onSearchWidgetReady?: (search: Search) => void;
}> = ({ children, onSearchWidgetReady }) => {
  // useRef
  const mapRef = useRef<HTMLDivElement>(null);
  // useState
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [view, setView] = useState<MapView | null>(null);
  const [layerMap, setLayerMap] = useState<
    Map<number, FeatureLayer | MapImageLayer>
  >(new Map());

  const [searchWidget, setSearchWidget] = useState<Search | null>(null);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { layer, searchLocation } = useAppSelector(
    (state) => state.mapInteraktif
  );

  const createLayer = (url: string) => {
    const urlFixed = getPathFromUrl(url);
    if (/\d+$/.test(urlFixed)) {
      // const tes = "/server/rest/services/dgcfrhmh/KPH_AR_250K/MapServer/2";
      // const tes2 = "/server/rest/services/jbcdsabhx/PPKH_AR_50K/MapServer/1";
      return new FeatureLayer({ url: `/klhk-dss/${urlFixed}` });
    } else {
      return new MapImageLayer({ url: `/klhk-dss/${urlFixed}` });
    }
  };

  // Function to add or remove layers
  const getUrlFromLayer = () => {
    if (layer.length > 0 && view) {
      // Separate active and inactive layers
      const activeLayers = layer.filter(
        (item) => item.isActive && !item.isUsed
      );
      const inactiveLayers = layer.filter(
        (item) => !item.isActive && !item.isUsed
      );

      // Add active layers to the map
      activeLayers.forEach((item) => {
        item.data?.forEach((childItem) => {
          // Only add if the layer is not already in the map
          if (!layerMap.has(childItem.Id)) {
            const newLayer = createLayer(childItem.Url);
            view.map.add(newLayer);
            setLayerMap((prev) => new Map(prev).set(childItem.Id, newLayer));
          }
        });
      });

      // Remove inactive layers from the map
      inactiveLayers.forEach((item) => {
        item.data?.forEach((childItem) => {
          const existingLayer = layerMap.get(childItem.Id);
          if (existingLayer) {
            view.map.remove(existingLayer);
            setLayerMap((prev) => {
              const newLayerMap = new Map(prev);
              newLayerMap.delete(childItem.Id);
              return newLayerMap;
            });
          }
        });
      });
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

      const search = new Search({
        view: mapView,
        locationEnabled: true,
      });
      setSearchWidget(search);
      onSearchWidgetReady?.(search);

      // Remove default zoom controls
      mapView.ui.remove("zoom");
      mapView.on("click", (event) => {
        const lat = event.mapPoint.latitude;
        const long = event.mapPoint.longitude;
        dispatch(setLocation({ latitude: lat, longitude: long }));
        dispatch(setIsOpenModalMap(true));
      });

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
    if (searchWidget && searchLocation) {
      searchWidget.search(searchLocation);
    }
  }, [searchLocation, searchWidget]);
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
