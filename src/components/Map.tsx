import { useEffect, useRef } from "react";

// Import ArcGIS modules
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
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
      // Bendung Rentang, Cirebon coordinates: 108.6075, -6.7034
      const view = new MapView({
        container: mapRef.current,
        map: webmap,
        zoom: 15,
        center: [108.6075, -6.7034], // Bendung Rentang, Cirebon coordinates
      });

      // Store the view reference
      viewRef.current = view;

      // Add widgets when view is ready
      view.when(() => {
        // Add a marker for Bendung Rentang
        const bendungPoint = new Point({
          longitude: 108.6075,
          latitude: -6.7034,
        });

        const markerSymbol = new SimpleMarkerSymbol({
          style: "circle",
          size: 12,
          color: "red",
          outline: {
            color: "white",
            width: 2,
          },
        });

        const pointGraphic = new Graphic({
          geometry: bendungPoint,
          symbol: markerSymbol,
          attributes: {
            name: "Bendung Rentang",
            description: "Dam in Cirebon",
          },
          popupTemplate: {
            title: "{name}",
            content: "{description}",
          },
        });

        view.graphics.add(pointGraphic);

        // Create polygons around Bendung Rentang
        // Polygon 1: Main Dam Structure
        const damPolygon = new Polygon({
          rings: [
            [
              [108.6065, -6.7034],
              [108.6085, -6.7034],
              [108.6085, -6.7044],
              [108.6065, -6.7044],
              [108.6065, -6.7034],
            ],
          ],
          spatialReference: { wkid: 4326 },
        });

        const damSymbol = new SimpleFillSymbol({
          color: [0, 100, 255, 0.5],
          outline: {
            color: [0, 50, 200, 1],
            width: 2,
          },
        });

        const damGraphic = new Graphic({
          geometry: damPolygon,
          symbol: damSymbol,
          attributes: {
            name: "Main Dam Structure",
            description: "The main structure of Bendung Rentang",
          },
          popupTemplate: {
            title: "{name}",
            content: "{description}",
          },
        });

        view.graphics.add(damGraphic);

        // Polygon 2: Water Reservoir Area
        const reservoirPolygon = new Polygon({
          rings: [
            [
              [108.6055, -6.7024],
              [108.6095, -6.7024],
              [108.6095, -6.7034],
              [108.6055, -6.7034],
              [108.6055, -6.7024],
            ],
          ],
          spatialReference: { wkid: 4326 },
        });

        const reservoirSymbol = new SimpleFillSymbol({
          color: [0, 150, 255, 0.4],
          outline: {
            color: [0, 100, 200, 1],
            width: 1.5,
          },
        });

        const reservoirGraphic = new Graphic({
          geometry: reservoirPolygon,
          symbol: reservoirSymbol,
          attributes: {
            name: "Water Reservoir",
            description: "Water reservoir area of Bendung Rentang",
          },
          popupTemplate: {
            title: "{name}",
            content: "{description}",
          },
        });

        view.graphics.add(reservoirGraphic);

        // Polygon 3: Irrigation Channel
        const channelPolygon = new Polygon({
          rings: [
            [
              [108.6085, -6.7044],
              [108.6095, -6.7044],
              [108.6095, -6.7064],
              [108.6085, -6.7064],
              [108.6085, -6.7044],
            ],
          ],
          spatialReference: { wkid: 4326 },
        });

        const channelSymbol = new SimpleFillSymbol({
          color: [70, 200, 255, 0.6],
          outline: {
            color: [30, 150, 200, 1],
            width: 1,
          },
        });

        const channelGraphic = new Graphic({
          geometry: channelPolygon,
          symbol: channelSymbol,
          attributes: {
            name: "Irrigation Channel",
            description: "Main irrigation channel from Bendung Rentang",
          },
          popupTemplate: {
            title: "{name}",
            content: "{description}",
          },
        });

        view.graphics.add(channelGraphic);

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
