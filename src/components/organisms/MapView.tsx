import React, { useEffect, useRef } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import "@arcgis/core/assets/esri/themes/light/main.css";

const MapComponent: React.FC = () => {
  const mapDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        basemap: "topo-vector", // Pilih basemap yang diinginkan
      });

      const view = new MapView({
        container: mapDiv.current, // Referensi elemen HTML
        map: webmap,
        center: [106.8456, -6.2088], // Koordinat Jakarta (default center)
        zoom: 10,
      });

      const urlSample =
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";

      const urlKlhk =
        // "https://geoportal.menlhk.go.id/server/rest/services/Time_Series/DEF_2016_2017/MapServer";
        "/klhk-dss/server/rest/services/Time_Series/DEF_2016_2017/MapServer";

      const layer0 = new FeatureLayer({
        url: `${urlSample}/0`,
      });
      const layer1 = new FeatureLayer({
        url: `${urlSample}/1`,
      });
      const layer2 = new FeatureLayer({
        url: `${urlSample}/2`,
      });
      const layer3 = new FeatureLayer({
        url: `${urlSample}/3`,
      });
      const layerklhk = new FeatureLayer({
        url: `${urlKlhk}/0`,
      });

      // webmap.addMany([layer3, layer2, layer1, layer0]);
      webmap.add(layerklhk);

      return () => {
        // Cleanup untuk mencegah kebocoran memori
        if (view) {
          view.destroy();
        }
      };
    }
  }, []);

  return <div style={{ height: "100vh", width: "100%" }} ref={mapDiv}></div>;
};

export default MapComponent;
