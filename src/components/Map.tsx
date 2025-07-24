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
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

// Import CSS for ArcGIS API
import "@arcgis/core/assets/esri/themes/light/main.css";

interface FeatureGeometryPoint {
  longitude: number;
  latitude: number;
}
interface FeatureGeometryPolygon {
  rings: number[][][];
}
interface FeatureGeometryPolyline {
  paths: number[][][];
}
interface FeatureSymbol {
  color: number[];

  // extra properties
  type?: string;
  style?: string;
  size?: number;
  outline?: {
    color: number[];
    width: number;
  };
  width?: number;
}
interface MapFeaturePoint {
  id: string;
  type: "point";
  geometry: FeatureGeometryPoint;
  symbol?: FeatureSymbol;
  attributes?: Record<string, unknown>;
}
interface MapFeaturePolygon {
  id: string;
  type: "polygon";
  geometry: FeatureGeometryPolygon;
  symbol?: FeatureSymbol;
  attributes?: Record<string, unknown>;
}
interface MapFeaturePolyline {
  id: string;
  type: "polyline";
  geometry: FeatureGeometryPolyline;
  symbol?: FeatureSymbol;
  attributes?: Record<string, unknown>;
}
interface MapDataView {
  longitude: number;
  latitude: number;
  zoom: number;
}
interface MapData {
  view: MapDataView;
  features?: MapFeaturePoint[] | MapFeaturePolygon[] | MapFeaturePolyline[];
}

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const pointGraphicsRef = useRef<Graphic[]>([]);
  const polygonGraphicsRef = useRef<Graphic[]>([]);
  const polylineGraphicsRef = useRef<Graphic[]>([]);
  const refreshIntervalRef = useRef<number | null>(null);
  const polygonTransparencyRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
  const firstTimeFetch = useRef(true);
  const currentTransparencyValue = useRef<number>(0.5); // Default transparency value

  // Function to update polygon transparency for all polygon graphics
  const updatePolygonTransparency = (transparency: number) => {
    console.log("Updating polygon transparency to:", transparency);
    console.log(
      "Number of polygons to update:",
      polygonGraphicsRef.current.length
    );

    currentTransparencyValue.current = transparency;

    if (polygonGraphicsRef.current.length > 0) {
      // Update all polygon graphics
      polygonGraphicsRef.current.forEach((graphic, index) => {
        const symbol = graphic.symbol as SimpleFillSymbol;

        if (symbol) {
          // Get the current color
          const color = symbol.color as any;
          if (color && Array.isArray(color)) {
            // Create a new color array with updated transparency
            const newColor = [...color.slice(0, 3), transparency];

            console.log(
              `Updating polygon ${index} color from`,
              color,
              "to",
              newColor
            );

            // Create a new symbol with the updated color
            const newSymbol = new SimpleFillSymbol({
              color: newColor,
              outline: symbol.outline,
            });

            // Update the graphic's symbol
            graphic.symbol = newSymbol;
          }
        }
      });

      // Graphics should update automatically when symbol is changed
    } else {
      console.log("No polygons found to update transparency");
    }
  };

  // Function to create a custom legend HTML element
  const createLegendHTML = () => {
    const legendContainer = document.createElement("div");
    legendContainer.className = "esri-widget esri-component";
    legendContainer.style.padding = "10px";
    legendContainer.style.backgroundColor = "white";
    legendContainer.style.minWidth = "150px";
    legendContainer.style.maxWidth = "200px";

    const legendTitle = document.createElement("div");
    legendTitle.innerHTML = "<strong>Legend</strong>";
    legendTitle.style.marginBottom = "8px";
    legendTitle.style.borderBottom = "1px solid #ccc";
    legendTitle.style.paddingBottom = "5px";
    legendContainer.appendChild(legendTitle);

    return legendContainer;
  };

  // Function to extract color from ArcGIS symbol
  const extractColorFromSymbol = (symbol: any): number[] => {
    console.log("Extracting color from symbol:", symbol);
    
    // For ArcGIS symbols, color might be stored differently
    let color = null;
    
    if (symbol.color) {
      if (Array.isArray(symbol.color)) {
        color = symbol.color;
      } else if (symbol.color.r !== undefined) {
        // ArcGIS Color object format
        color = [symbol.color.r, symbol.color.g, symbol.color.b, symbol.color.a || 1];
      } else if (typeof symbol.color === 'string') {
        // Handle hex colors or named colors
        console.log("String color detected:", symbol.color);
        return [128, 128, 128, 1]; // Default gray for now
      }
    }
    
    console.log("Extracted color:", color);
    return color || [128, 128, 128, 1]; // Default gray
  };
  
  // Function to extract outline color from ArcGIS symbol
  const extractOutlineColorFromSymbol = (symbol: any): number[] => {
    console.log("Extracting outline color from symbol:", symbol);
    
    let outlineColor = null;
    
    if (symbol.outline && symbol.outline.color) {
      if (Array.isArray(symbol.outline.color)) {
        outlineColor = symbol.outline.color;
      } else if (symbol.outline.color.r !== undefined) {
        // ArcGIS Color object format
        outlineColor = [symbol.outline.color.r, symbol.outline.color.g, symbol.outline.color.b, symbol.outline.color.a || 1];
      }
    }
    
    console.log("Extracted outline color:", outlineColor);
    return outlineColor || [0, 0, 0, 1]; // Default black
  };

  // Function to add legend item
  const addLegendItem = (
    container: HTMLDivElement,
    symbol: any,
    title: string,
    type: string
  ) => {
    const item = document.createElement("div");
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.marginBottom = "5px";

    const symbolDiv = document.createElement("div");
    symbolDiv.style.width = "20px";
    symbolDiv.style.height = "15px";
    symbolDiv.style.marginRight = "8px";
    symbolDiv.style.border = "1px solid #ccc";

    if (type === "point") {
      const color = extractColorFromSymbol(symbol);
      symbolDiv.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] || 1})`;
      symbolDiv.style.borderRadius = "50%";
    } else if (type === "polygon") {
      const color = extractColorFromSymbol(symbol);
      const outline = extractOutlineColorFromSymbol(symbol);
      symbolDiv.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] || 0.5})`;
      symbolDiv.style.borderColor = `rgba(${outline[0]}, ${outline[1]}, ${outline[2]}, ${outline[3] || 1})`;
      symbolDiv.style.borderWidth = "2px";
    } else if (type === "polyline") {
      const color = extractColorFromSymbol(symbol);
      symbolDiv.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] || 1})`;
      symbolDiv.style.height = "3px";
    }

    const label = document.createElement("span");
    label.innerHTML = title;
    label.style.fontSize = "12px";

    item.appendChild(symbolDiv);
    item.appendChild(label);
    container.appendChild(item);
  };

  // Function to update the legend with feature data
  const updateLegend = (view: MapView) => {
    // Remove existing legend if it exists
    if (legendRef.current) {
      view.ui.remove(legendRef.current);
    }

    // Create new legend container
    const legendContainer = createLegendHTML();

    // Add legend items for each individual feature
    // Add point features
    pointGraphicsRef.current.forEach((graphic) => {
      const symbol = graphic.symbol as SimpleMarkerSymbol;
      const featureName = (graphic.attributes?.name as string) || "Point Feature";
      addLegendItem(legendContainer, symbol, featureName, "point");
    });

    // Add polygon features
    polygonGraphicsRef.current.forEach((graphic) => {
      const symbol = graphic.symbol as SimpleFillSymbol;
      const featureName = (graphic.attributes?.name as string) || "Polygon Feature";
      addLegendItem(legendContainer, symbol, featureName, "polygon");
    });

    // Add polyline features
    polylineGraphicsRef.current.forEach((graphic) => {
      const symbol = graphic.symbol as SimpleLineSymbol;
      const featureName = (graphic.attributes?.name as string) || "Line Feature";
      addLegendItem(legendContainer, symbol, featureName, "polyline");
    });

    // Add legend to the map UI
    view.ui.add(legendContainer, "bottom-left");
    legendRef.current = legendContainer;

    console.log("Legend created and added to UI with individual feature names");
  };

  // Function to fetch data from data.json
  const fetchMapData = async (view: MapView) => {
    try {
      const response = await fetch("/data.json");
      const data: MapData = await response.json();

      // Clear existing graphics from previous fetches
      if (graphicsLayerRef.current) {
        graphicsLayerRef.current.removeAll();
      } else {
        // Create a graphics layer if it doesn't exist
        graphicsLayerRef.current = new GraphicsLayer();
        if (view.map) {
          view.map.add(graphicsLayerRef.current);
        }
      }

      // Reset graphics arrays
      pointGraphicsRef.current = [];
      polygonGraphicsRef.current = [];
      polylineGraphicsRef.current = [];

      // Process and add features if they exist
      if (data.features && data.features.length > 0) {
        data.features.forEach((feature) => {
          let graphic: Graphic | null = null;

          // Create the appropriate geometry based on feature type
          if (feature.type === "point") {
            const point = new Point(feature.geometry as FeatureGeometryPoint);

            // Use color from feature if available, otherwise use default or symbol
            let symbolColor: string | number[] = "red";
            if (
              feature.symbol?.color &&
              Array.isArray(feature.symbol.color) &&
              feature.symbol.color.length >= 3
            ) {
              // Use the color array from the feature with opacity
              symbolColor =
                feature.symbol.color.length === 4
                  ? feature.symbol.color
                  : [...feature.symbol.color, 1]; // Add opacity if not provided
            }

            const symbol = new SimpleMarkerSymbol({
              style: "circle",
              size: feature.symbol?.size || 12,
              color: symbolColor,
              outline: feature.symbol?.outline || { color: "white", width: 2 },
            });

            graphic = new Graphic({
              geometry: point,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: {
                title: (feature.attributes?.name || "Point") as string,
                content: (feature.attributes?.description ||
                  "Point feature") as string,
              },
            });
          } else if (feature.type === "polygon") {
            const polygon = new Polygon(
              feature.geometry as FeatureGeometryPolygon
            );

            // Use color from feature if available, otherwise use default
            let fillColor = [50, 205, 50, 0.5]; // Default lime color with 0.5 opacity
            let outlineColor = [0, 128, 0, 1];

            if (
              feature.symbol?.color &&
              Array.isArray(feature.symbol.color) &&
              feature.symbol.color.length >= 3
            ) {
              // Use the color array from the feature with opacity
              fillColor =
                feature.symbol.color.length === 4
                  ? feature.symbol.color
                  : [...feature.symbol.color, 0.5]; // Add default opacity if not provided

              // Create a darker version of the color for the outline
              outlineColor = [
                Math.max(0, fillColor[0] - 50),
                Math.max(0, fillColor[1] - 50),
                Math.max(0, fillColor[2] - 50),
                1,
              ];
            }

            const symbol = new SimpleFillSymbol({
              color: fillColor,
              outline: feature.symbol?.outline || {
                color: outlineColor,
                width: 2,
              },
            });

            graphic = new Graphic({
              geometry: polygon,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: {
                title: (feature.attributes?.name || "Polygon") as string,
                content: (feature.attributes?.description ||
                  "Polygon feature") as string,
              },
            });

            // Apply current transparency to newly created polygon
            const polygonSymbol = graphic.symbol as SimpleFillSymbol;
            if (polygonSymbol && polygonSymbol.color) {
              const color = polygonSymbol.color as any;
              if (color && Array.isArray(color)) {
                const newColor = [
                  ...color.slice(0, 3),
                  currentTransparencyValue.current,
                ];
                const newSymbol = new SimpleFillSymbol({
                  color: newColor,
                  outline: polygonSymbol.outline,
                });
                graphic.symbol = newSymbol;
              }
            }
          } else if (feature.type === "polyline") {
            const polyline = new Polyline(
              feature.geometry as FeatureGeometryPolyline
            );

            // Use color from feature if available, otherwise use default
            let lineColor = [0, 0, 255, 1]; // Default blue color

            if (
              feature.symbol?.color &&
              Array.isArray(feature.symbol.color) &&
              feature.symbol.color.length >= 3
            ) {
              // Use the color array from the feature with opacity
              lineColor =
                feature.symbol.color.length === 4
                  ? feature.symbol.color
                  : [...feature.symbol.color, 1]; // Add full opacity if not provided
            }

            const symbol = new SimpleLineSymbol({
              color: lineColor,
              width: feature.symbol?.width || 3,
            });

            graphic = new Graphic({
              geometry: polyline,
              symbol,
              attributes: feature.attributes || { id: feature.id },
              popupTemplate: {
                title: (feature.attributes?.name || "Line") as string,
                content: (feature.attributes?.description ||
                  "Line feature") as string,
              },
            });
          }

          if (graphic) {
            // Add to the appropriate graphics array based on feature type
            if (feature.type === "point") {
              pointGraphicsRef.current.push(graphic);
            } else if (feature.type === "polygon") {
              polygonGraphicsRef.current.push(graphic);
            } else if (feature.type === "polyline") {
              polylineGraphicsRef.current.push(graphic);
            }

            // Add to the graphics layer
            graphicsLayerRef.current?.add(graphic);
          }
        });

        // If we found a feature with is_center=true, center the map on it
        if (data.view && firstTimeFetch.current) {
          view.goTo({
            center: [data.view.longitude, data.view.latitude],
            zoom: data.view.zoom, // Maintain current zoom level
          });
        }

        // Update the legend with the new feature data
        console.log("Updating legend with feature data...");
        console.log("Points:", pointGraphicsRef.current.length);
        console.log("Polygons:", polygonGraphicsRef.current.length);
        console.log("Polylines:", polylineGraphicsRef.current.length);
        updateLegend(view);
      }
    } catch (error) {
      console.error("Error fetching map data:", error);
    } finally {
      firstTimeFetch.current = false;
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
        zoom: 6,
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

        // Legend will be created dynamically in updateLegend function

        // Debug: Add console log to check if graphics are being created
        console.log("Map view ready, setting up widgets...");

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

        // Add slider to the UI (position it at top-left to avoid conflict with legend)
        view.ui.add(sliderContainer, "top-left");
        polygonTransparencyRef.current = sliderContainer;

        console.log("Transparency slider created and added to UI");

        // Initial data fetch
        setTimeout(() => {
          fetchMapData(view);
        }, 1000);

        // Set up auto-refresh every 10 seconds
        refreshIntervalRef.current = window.setInterval(() => {
          fetchMapData(view);
        }, 1000 * 3); // seconds
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
