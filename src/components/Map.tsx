import { useEffect, useRef } from "react";

// Import ArcGIS modules
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Search from "@arcgis/core/widgets/Search";
import Legend from "@arcgis/core/widgets/Legend";

// Import CSS for ArcGIS API
import "@arcgis/core/assets/esri/themes/light/main.css";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      // Create a new WebMap instance with the portal item ID
      const webmap = new WebMap({
        portalItem: {
          id: "02b37471d5d84cacbebcccd785460e94",
        },
      });

      // Create a new MapView instance
      const view = new MapView({
        container: mapRef.current,
        map: webmap,
        zoom: 10,
        center: [-118.38, 33.34],
      });

      // Store the view reference
      viewRef.current = view;

      // Add widgets when view is ready
      view.when(() => {
        // Add a point graphic
        const point = new Point({
          longitude: -118.38,
          latitude: 33.34,
        });

        const markerSymbol = new SimpleMarkerSymbol({
          style: "triangle",
          size: 15,
          color: "red",
          outline: {
            color: "white",
            width: 2,
          },
        });

        const pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
        });

        view.graphics.add(pointGraphic);

        // Add widgets
        const search = new Search({ view });
        view.ui.add(search, "top-right");

        const legend = new Legend({ view });
        view.ui.add(legend, "bottom-left");
      });

      // Clean up function
      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
}
