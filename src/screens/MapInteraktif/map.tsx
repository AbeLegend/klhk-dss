"use client";
// lib
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";

import "@arcgis/core/assets/esri/themes/light/main.css";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

// local
import { cn, extractMapNumber, getPathFromUrl } from "@/lib";
import {
  setIsOpenModalMap,
  setLocation,
  updateLayer,
} from "@/redux/Map/MapInteraktif/slice";

// type
interface UsedLayerProps {
  url: string;
  id: number;
  paramUrl: string | null;
  isUsed: boolean;
}

const MapComponent: FC<{
  children: ReactNode;
  onSearchWidgetReady?: (search: Search) => void;
}> = ({ children, onSearchWidgetReady }) => {
  // useRef
  const mapRef = useRef<HTMLDivElement>(null);
  // useState
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [view, setView] = useState<MapView | null>(null);
  const [layerMap, setLayerMap] = useState<Map<number, FeatureLayer>>(
    new Map()
  );
  const [searchWidget, setSearchWidget] = useState<Search | null>(null);
  // useDispatch
  const dispatch = useDispatch();
  // useAppSelector
  const { layer, searchLocation } = useAppSelector(
    (state) => state.mapInteraktif
  );

  // function to add or remove layers
  const getUrlFromLayer = () => {
    if (layer.length > 0) {
      const activeLayers = layer.filter(
        (item) => item.WebService.isActive && !item.WebService.isUsed
      );
      const inactiveLayers = layer.filter(
        (item) => !item.WebService.isActive && !item.WebService.isUsed
      );

      if (activeLayers.length > 0) {
        const filteredLayer: UsedLayerProps[] = activeLayers.map((item) => {
          const path = item.WebService.Url;
          const urlFixed = getPathFromUrl(path);
          const paramUrl = extractMapNumber(urlFixed);
          return {
            id: item.WebService.Id,
            url: urlFixed,
            paramUrl: paramUrl,
            isUsed: item.WebService.isUsed,
          };
        });
        fetchLayerInfo(filteredLayer);
      }

      if (inactiveLayers.length > 0) {
        removeLayers(inactiveLayers.map((item) => item.WebService.Id));
      }
    }
  };

  const fetchLayerInfo = async (data: UsedLayerProps[]) => {
    try {
      if (data.length > 0) {
        for (const item of data) {
          const { id, isUsed, paramUrl, url } = item;

          if (!isUsed && view) {
            let featureLayer: FeatureLayer;

            if (paramUrl === null) {
              // Fetching the details of all layers if no specific paramUrl is defined
              const response = await fetch(`/klhk-dss${url}?f=json`);
              const data = await response.json();

              if (data.layers) {
                // Iterate over the available layers and add them to the map
                data.layers.forEach((layerInfo: any) => {
                  featureLayer = new FeatureLayer({
                    url: `/klhk-dss${url}/${layerInfo.id}`,
                  });
                  view.map.add(featureLayer);
                  layerMap.set(id, featureLayer);
                });
              }
            } else {
              // Add a specific layer using the paramUrl
              featureLayer = new FeatureLayer({
                url: `/klhk-dss${url}`,
              });
              view.map.add(featureLayer);
              layerMap.set(id, featureLayer);
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
  const removeLayers = (layerIds: number[]) => {
    if (view && layerIds.length > 0) {
      layerIds.forEach((id) => {
        const layerToRemove = layerMap.get(id);
        if (layerToRemove) {
          view.map.remove(layerToRemove);
          layerMap.delete(id);

          // Mark the layer as unused
          dispatch(
            updateLayer({
              id: id,
              updatedData: {
                isActive: false,
                isUsed: false,
              },
            })
          );
        }
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
