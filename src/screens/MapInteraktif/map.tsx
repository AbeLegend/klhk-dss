"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import Search from "@arcgis/core/widgets/Search";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

import "@arcgis/core/assets/esri/themes/light/main.css";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

// local
import {
  cn,
  getPathFromUrl,
  getUrlIdentifier,
  removeUrlEndingNumber,
} from "@/lib";
import {
  setIsOpenModalMap,
  setLocation,
} from "@/redux/Map/MapInteraktif/slice";

const MapComponent: FC<{
  children: ReactNode;
  onSearchWidgetReady?: (search: Search) => void;
  onTriggerSidebar: () => void;
}> = ({ children, onSearchWidgetReady, onTriggerSidebar }) => {
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
  const { layer, searchLocation, isOpenModal, location } = useAppSelector(
    (state) => state.mapInteraktif
  );

  const handleMapClick = async (lat: number, long: number, map: MapView) => {
    map.graphics.removeAll();
    const point = new Point({
      longitude: long,
      latitude: lat,
    });
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: new SimpleMarkerSymbol({
        color: "#F1B113",
        size: "10px",
        outline: {
          color: "#188218",
          width: 1,
        },
      }),
    });
    map.graphics.add(pointGraphic);
    // Update location in Redux
    await dispatch(setLocation({ latitude: lat, longitude: long }));
    // Open modal in Redux
    dispatch(setIsOpenModalMap(true));
    // Trigger Sidebar action after location update
    onTriggerSidebar();
  };

  const createLayer = (url: string) => {
    const prefix = getUrlIdentifier(url);
    const urlFixed = getPathFromUrl(url);
    return new MapImageLayer({
      url: `/${prefix}/${removeUrlEndingNumber(urlFixed)}`,
    });
  };

  // Function to add or remove layers
  const getUrlFromLayer = () => {
    if (layer.length > 0 && view) {
      const activeLayers = layer.filter(
        (item) => item.isActive && !item.isUsed
      );
      const inactiveLayers = layer.filter(
        (item) => !item.isActive && !item.isUsed
      );

      activeLayers.forEach((item) => {
        item.data?.forEach((childItem) => {
          const childId = childItem.WebService.Id;
          const childUrl = childItem.WebService.Url;

          if (!layerMap.has(childId)) {
            const newLayer = createLayer(childUrl);
            view.map.add(newLayer);
            setLayerMap((prev) => new Map(prev).set(childId, newLayer));
          }
        });
      });

      inactiveLayers.forEach((item) => {
        item.data?.forEach((childItem) => {
          const childId = childItem.WebService.Id;
          const existingLayer = layerMap.get(childId);

          if (existingLayer) {
            view.map.remove(existingLayer);
            setLayerMap((prev) => {
              const newLayerMap = new Map(prev);
              newLayerMap.delete(childId);
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

      mapView.ui.remove("zoom");
      mapView.on("click", async (event) => {
        const lat = event.mapPoint.latitude;
        const long = event.mapPoint.longitude;

        handleMapClick(lat, long, mapView);
      });

      mapView
        .when(() => {
          setIsMapLoaded(true);
          setView(mapView);
        })
        .catch((error) => {
          console.error("Error loading the map:", error);
        });

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
    console.log({ layer });
  }, [layer]);

  return (
    <div ref={mapRef} className={cn(["h-screen w-full relative"])}>
      {isMapLoaded && children}
    </div>
  );
};

export default MapComponent;
