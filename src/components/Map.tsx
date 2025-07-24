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
  is_center?: boolean;
  type: "point" | "polygon" | "polyline";
  color: number[];
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
  const polygonTransparencyRef = useRef<HTMLDivElement>(null);
  const currentPolygonGraphicRef = useRef<Graphic | null>(null);

  // Function to update polygon transparency
  const updatePolygonTransparency = (transparency: number) => {
    if (currentPolygonGraphicRef.current && viewRef.current) {
      const graphic = currentPolygonGraphicRef.current;
      const symbol = graphic.symbol as SimpleFillSymbol;

      if (symbol) {
        // Get the current color
        const color = symbol.color as any;
        if (color && Array.isArray(color)) {
          // Create a new color array with updated transparency
          const newColor = [...color.slice(0, 3), transparency];

          // Create a new symbol with the updated color
          const newSymbol = new SimpleFillSymbol({
            color: newColor,
            outline: symbol.outline,
          });

          // Update the graphic's symbol
          graphic.symbol = newSymbol;
        }
      }
    }
  };

  // Function to get center coordinates from a feature geometry
  const getCenterFromGeometry = (
    feature: MapFeature
  ): [number, number] | null => {
    if (
      feature.type === "point" &&
      feature.geometry.longitude !== undefined &&
      feature.geometry.latitude !== undefined
    ) {
      // For point features, use the point coordinates directly
      return [feature.geometry.longitude, feature.geometry.latitude];
    } else if (
      feature.type === "polygon" &&
      feature.geometry.rings &&
      feature.geometry.rings.length > 0
    ) {
      // For polygon features, calculate the centroid of the first ring
      const ring = feature.geometry.rings[0];
      if (ring && ring.length > 0) {
        let sumX = 0;
        let sumY = 0;
        ring.forEach((coord: [number, number]) => {
          sumX += coord[0];
          sumY += coord[1];
        });
        return [sumX / ring.length, sumY / ring.length];
      }
    } else if (
      feature.type === "polyline" &&
      feature.geometry.paths &&
      feature.geometry.paths.length > 0
    ) {
      // For polyline features, use the midpoint of the first path
      const path = feature.geometry.paths[0];
      if (path && path.length > 0) {
        const midIndex = Math.floor(path.length / 2);
        return path[midIndex];
      }
    }
    return null;
  };

  // Function to fetch data from data.json
  const fetchMapData = async (view: MapView) => {
    try {
      const response = await fetch("/data.json");
      const data: MapData = await response.json();

      // Clear existing graphics from previous fetches
      if (graphicsLayerRef.current.length > 0) {
        graphicsLayerRef.current.forEach((graphic) => {
          view.graphics.remove(graphic);
        });
        graphicsLayerRef.current = [];
        currentPolygonGraphicRef.current = null;
      }

      // Track if we find a feature with is_center=true
      let centerFeature: MapFeature | null = null;

      // Process and add features if they exist
      if (data.features && data.features.length > 0) {
        data.features.forEach((feature) => {
          let graphic: Graphic | null = null;

          // Check if this feature should be used as the map center
          if (feature.is_center === true) {
            centerFeature = feature;
          }

          // Create the appropriate geometry based on feature type
          if (feature.type === "point") {
            const point = new Point(feature.geometry);
            const symbol =
              feature.symbol ||
              new SimpleMarkerSymbol({
                style: "circle",
                size: 12,
                color: "red",
                outline: { color: "white", width: 2 },
              });

            graphic = new Graphic({
              geometry: point,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Point",
                content: feature.attributes?.description || "Point feature",
              },
            });
          } else if (feature.type === "polygon") {
            const polygon = new Polygon(feature.geometry);
            const symbol =
              feature.symbol ||
              new SimpleFillSymbol({
                color: [50, 205, 50, 0.5], // Default lime color with 0.5 opacity
                outline: { color: [0, 128, 0, 1], width: 2 },
              });

            graphic = new Graphic({
              geometry: polygon,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Polygon",
                content: feature.attributes?.description || "Polygon feature",
              },
            });

            // Store reference to polygon graphic for transparency control
            currentPolygonGraphicRef.current = graphic;
          } else if (feature.type === "polyline") {
            const polyline = new Polyline(feature.geometry);
            const symbol =
              feature.symbol ||
              new SimpleLineSymbol({
                color: [0, 0, 255, 1], // Blue color
                width: 3,
              });

            graphic = new Graphic({
              geometry: polyline,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: feature.popupTemplate || {
                title: feature.attributes?.name || "Line",
                content: feature.attributes?.description || "Line feature",
              },
            });
          }

          if (graphic) {
            view.graphics.add(graphic);
            graphicsLayerRef.current.push(graphic);
          }
        });

        // If we found a feature with is_center=true, center the map on it
        if (centerFeature) {
          const centerCoords = getCenterFromGeometry(centerFeature);
          if (centerCoords) {
            view.goTo({
              center: centerCoords,
              zoom: view.zoom, // Maintain current zoom level
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      // Create a new Map instance with satellite basemap that shows place names
      const map = new Map({
        basemap: "hybrid", // "hybrid" is satellite imagery with labels
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
            breakpoint: false,
          },
        },
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
          if (
            point &&
            typeof point.longitude === "number" &&
            typeof point.latitude === "number"
          ) {
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

        // Create transparency slider control
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "esri-widget esri-component";
        sliderContainer.style.padding = "10px";
        sliderContainer.style.backgroundColor = "white";
        sliderContainer.style.width = "250px";

        const sliderLabel = document.createElement("div");
        sliderLabel.innerHTML = "Polygon Transparency:";
        sliderLabel.style.marginBottom = "5px";
        sliderLabel.style.fontWeight = "bold";

        const sliderValueDisplay = document.createElement("span");
        sliderValueDisplay.innerHTML = "50%";
        sliderValueDisplay.style.float = "right";
        sliderLabel.appendChild(sliderValueDisplay);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "0";
        slider.max = "1";
        slider.step = "0.01";
        slider.value = "0.5";
        slider.style.width = "100%";

        // Add event listener to slider
        slider.addEventListener("input", (e) => {
          const value = parseFloat((e.target as HTMLInputElement).value);
          sliderValueDisplay.innerHTML = `${Math.round(value * 100)}%`;
          updatePolygonTransparency(value);
        });

        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(slider);

        // Add slider to the UI
        view.ui.add(sliderContainer, "bottom-left");
        polygonTransparencyRef.current = sliderContainer;

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
