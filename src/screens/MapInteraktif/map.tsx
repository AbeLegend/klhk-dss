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
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import request from "@arcgis/core/request";

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
import {
  SetIsShowOverlay,
  SetTriggerGetPropertiesByGeom,
  SetTriggerIntersect,
} from "@/redux/Map/LayerService/slice";

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
  const { layer, searchLocation } = useAppSelector(
    (state) => state.mapInteraktif
  );
  const {
    geom,
    IsShowOverlay,
    IsSummary,
    IsTriggerGetPropertiesByGeom,
    IsTriggerIntersect,
  } = useAppSelector((state) => state.layer);

  let activePointGraphic: Graphic | null = null;

  const handleMapClick = async (lat: number, long: number, map: MapView) => {
    if (activePointGraphic) map.graphics.remove(activePointGraphic);

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
    activePointGraphic = pointGraphic;

    map.graphics.add(pointGraphic);
    // Update location in Redux
    await dispatch(setLocation({ latitude: lat, longitude: long }));
    // Open modal in Redux
    dispatch(setIsOpenModalMap(true));
    console.log("INI PAS CLICK", IsSummary);

    // if (!IsShowOverlay) dispatch(SetIsShowOverlay(true));
    if (IsSummary) dispatch(SetTriggerIntersect(true));
    if (!IsSummary) dispatch(SetTriggerGetPropertiesByGeom(true));
    // Trigger Sidebar action after location update
    onTriggerSidebar();
  };

  const createLayer = (url: string) => {
    const prefix = getUrlIdentifier(url);
    const urlFixed = getPathFromUrl(url);
    const fullUrl = `/${prefix}${removeUrlEndingNumber(urlFixed)}?f=json`;
    return new MapImageLayer({
      url: fullUrl,
      useViewTime: true,
      imageFormat: "png32",
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
      // mapView.on("click", async (event) => {
      //   const lat = event.mapPoint.latitude;
      //   const long = event.mapPoint.longitude;

      //   handleMapClick(lat, long, mapView);
      // });

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
  useEffect(() => {
    if (view) {
      view.on("click", async (event) => {
        const lat = event.mapPoint.latitude;
        const long = event.mapPoint.longitude;
        handleMapClick(lat, long, view);
      });
    }
  }, [IsSummary, view]);

  useEffect(() => {
    if (view && geom !== "") {
      const geomData = JSON.parse(geom);
      const polygon = new Polygon({
        rings: geomData.coordinates[0],
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry: polygon,

        symbol: new SimpleFillSymbol({
          // color: [227, 139, 79, 0.8],
          // outline: {
          //   color: [255, 255, 255],
          //   width: 1,
          // },
        }),
      });
      view.when(() => {
        view.graphics.add(graphic);

        view
          .goTo(
            {
              target: polygon.extent.expand(5),
            },
            {
              animate: true,
              duration: 1000,
              easing: "ease-in-out",
            }
          )
          .catch((err) => console.error("Error during zoom: ", err));
      });
    }
  }, [view, geom]);

  return (
    <div ref={mapRef} className={cn(["h-screen w-full relative"])}>
      {isMapLoaded && children}
    </div>
  );
};

export default MapComponent;
