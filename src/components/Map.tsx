import { useEffect, useRef } from "react";

// Import ArcGIS modules
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import Search from "@arcgis/core/widgets/Search";
import Legend from "@arcgis/core/widgets/Legend";

// Import CSS for ArcGIS API
import "@arcgis/core/assets/esri/themes/light/main.css";

// Interface for map data from data.json
interface MapFeature {
  id: string;
  type: "point" | "polygon" | "polyline";
  geometry: any;
  symbol?: any;
  attributes?: Record<string, any>;
  popupTemplate?: {
    title: string;
    content: string | string[];
  };
}

interface MapData {
  features?: MapFeature[];
}

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<Graphic[]>([]);
  const refreshIntervalRef = useRef<number | null>(null);

  // Function to fetch data from data.json
  const fetchMapData = async (view: MapView) => {
    try {
      const response = await fetch('/data.json');
      const data: MapData = await response.json();
      
      // Clear existing graphics from previous fetches
      if (graphicsLayerRef.current.length > 0) {
        graphicsLayerRef.current.forEach(graphic => {
          view.graphics.remove(graphic);
        });
        graphicsLayerRef.current = [];
      }
      
      // Process and add features if they exist
      if (data.features && data.features.length > 0) {
        data.features.forEach(feature => {
          let graphic: Graphic | null = null;
          
          // Create the appropriate geometry based on feature type
          if (feature.type === "point") {
            const point = new Point(feature.geometry);
            const symbol = feature.symbol || new SimpleMarkerSymbol({
              style: "circle",
              size: 12,
              color: "red",
              outline: { color: "white", width: 2 }
            });
            
            graphic = new Graphic({
              geometry: point,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Point",
                content: feature.attributes?.description || "Point feature"
              }
            });
          } 
          else if (feature.type === "polygon") {
            const polygon = new Polygon(feature.geometry);
            const symbol = feature.symbol || new SimpleFillSymbol({
              color: [0, 100, 255, 0.5],
              outline: { color: [0, 50, 200, 1], width: 2 }
            });
            
            graphic = new Graphic({
              geometry: polygon,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Polygon",
                content: feature.attributes?.description || "Polygon feature"
              }
            });
          } 
          else if (feature.type === "polyline") {
            const polyline = new Polyline(feature.geometry);
            const symbol = feature.symbol || new SimpleLineSymbol({
              color: [0, 200, 255, 1],
              width: 3
            });
            
            graphic = new Graphic({
              geometry: polyline,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Line",
                content: feature.attributes?.description || "Line feature"
              }
            });
          }
          
          if (graphic) {
            view.graphics.add(graphic);
            graphicsLayerRef.current.push(graphic);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      // Create a new Map instance with satellite basemap that shows place names
      const map = new Map({
        basemap: "hybrid" // "hybrid" is satellite imagery with labels
      });

      // Create a new MapView instance
      // Bendung Rentang, Cirebon coordinates: 108.6075, -6.7034
      const view = new MapView({
        container: mapRef.current,
        map: map,
        zoom: 15,
        center: [108.6075, -6.7034], // Bendung Rentang, Cirebon coordinates
        popup: {
          dockEnabled: true,
          dockOptions: {
            position: "top-right",
            breakpoint: false
          }
        }
      });

      // Store the view reference
      viewRef.current = view;

      // Add widgets when view is ready
      view.when(() => {
        // Add coordinate display at bottom-right
        // Create a div element for coordinates
        const coordsDiv = document.createElement("div");
        coordsDiv.id = "coordsDiv";
        coordsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        coordsDiv.style.color = "white";
        coordsDiv.style.padding = "5px 10px";
        coordsDiv.style.borderRadius = "4px";
        coordsDiv.style.fontFamily = "monospace";
        coordsDiv.style.fontSize = "12px";
        coordsDiv.style.pointerEvents = "none";
        coordsDiv.innerHTML = "Longitude, Latitude";
        
        // Add the div to the view's UI in the bottom-right corner
        view.ui.add(coordsDiv, "bottom-right");
        
        // Update the div with the pointer's coordinates
        view.on("pointer-move", (event) => {
          const point = view.toMap({ x: event.x, y: event.y });
          if (point && typeof point.longitude === 'number' && typeof point.latitude === 'number') {
            const longitude = point.longitude.toFixed(6);
            const latitude = point.latitude.toFixed(6);
            coordsDiv.innerHTML = `Lon: ${longitude}, Lat: ${latitude}`;
          }
        });

        // Add search widget
        const search = new Search({ view });
        view.ui.add(search, "top-right");

        // Add legend widget
        const legend = new Legend({ view });
        view.ui.add(legend, "bottom-left");
        
        // Initial data fetch
        fetchMapData(view);
        
        // Set up auto-refresh every 10 seconds
        refreshIntervalRef.current = window.setInterval(() => {
          fetchMapData(view);
        }, 10000); // 10 seconds
      });

      // Clean up function
      return () => {
        if (viewRef.current) {
          viewRef.current.destroy();
          viewRef.current = null;
        }
        
        // Clear the refresh interval
        if (refreshIntervalRef.current !== null) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
}
