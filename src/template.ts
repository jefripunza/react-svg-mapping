import type { NodeTemplate, EdgeTemplate } from "./components/Diagram";

// Node Templates
const node_templates: NodeTemplate[] = [
  // Bendung (Weir) - Main water source
  {
    id: "bendung",
    name: "Bendung",
    type: "node",
    objects: [
      {
        type: "rect",
        fill: "#66ccff",
        stroke: "#335577",
        stroke_width: 3,
        width: 48,
        height: 48,
        y: -26,
      },
      {
        type: "circle",
        fill: "#FFFFFF",
        stroke: "#2E5C8A",
        stroke_width: 2,
        r: 12,
      },
      {
        type: "circle",
        fill: "#FFFFFF",
        stroke: "#2E5C8A",
        stroke_width: 2,
        r: 12,
        x: -25,
      },
      {
        type: "circle",
        fill: "#FFFFFF",
        stroke: "#2E5C8A",
        stroke_width: 2,
        r: 12,
        x: 25,
      },
    ],
    fields: [
      {
        id: "kebutuhan_air_irigasi",
        key: "kebutuhan_air_irigasi",
        name: "Kebutuhan Air Irigasi",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "nilai_kehilangan_0_1",
        key: "nilai_kehilangan_0_1",
        name: "Nilai kehilangan 0.1%",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "faktor_k",
        key: "faktor_k",
        name: "Faktor K",
        unit: "",
        type: "number",
      },
    ],
  },

  // Intake Bendung (Main water source)
  {
    id: "intake_bendung",
    name: "Intake Bendung",
    type: "node",
    objects: [
      {
        type: "rect",
        fill: "#66ccff",
        stroke: "#335577",
        stroke_width: 3,
        width: 48,
        height: 48,
        y: -36,
      },
      {
        type: "rect",
        fill: "white",
        stroke: "#335577",
        stroke_width: 1,
        width: 28,
        height: 28,
        y: -10,
      },
    ],
    fields: [
      {
        id: "kebutuhan_air_irigasi",
        key: "kebutuhan_air_irigasi",
        name: "Kebutuhan Air Irigasi",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "nilai_kehilangan_0_1",
        key: "nilai_kehilangan_0_1",
        name: "Nilai kehilangan 0.1%",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "faktor_k",
        key: "faktor_k",
        name: "Faktor K",
        unit: "",
        type: "number",
      },
    ],
  },

  // Pintu Air (Water Gate)
  {
    id: "pintu_air",
    name: "Pintu Air",
    type: "node",
    objects: [
      {
        type: "circle",
        fill: "#FFFFFF",
        stroke: "#2E5C8A",
        stroke_width: 2,
        r: 12,
      },
    ],
    fields: [
      {
        id: "kebutuhan_air_irigasi",
        key: "kebutuhan_air_irigasi",
        name: "Kebutuhan Air Irigasi",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "nilai_kehilangan_0_1",
        key: "nilai_kehilangan_0_1",
        name: "Nilai kehilangan 0.1%",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "faktor_k",
        key: "faktor_k",
        name: "Faktor K",
        unit: "",
        type: "number",
      },
    ],
  },
  // Bangunan Ukur (Measurement Structure)
  {
    id: "bangunan_ukur",
    name: "Bangunan Ukur",
    type: "node",
    objects: [
      {
        type: "rect",
        fill: "#90EE90",
        stroke: "#228B22",
        stroke_width: 2,
        width: 40,
        height: 20,
      },
    ],
    fields: [
      {
        id: "kebutuhan_air_irigasi",
        key: "kebutuhan_air_irigasi",
        name: "Kebutuhan Air Irigasi",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "nilai_kehilangan_0_1",
        key: "nilai_kehilangan_0_1",
        name: "Nilai kehilangan 0.1%",
        unit: "m³/s",
        type: "number",
      },
      {
        id: "faktor_k",
        key: "faktor_k",
        name: "Faktor K",
        unit: "",
        type: "number",
      },
    ],
  },
  // Saluran Sekunder (Secondary Channel)
  {
    id: "saluran_sekunder",
    name: "Saluran Sekunder",
    type: "node",
    objects: [
      {
        type: "rect",
        fill: "#FFE4B5",
        stroke: "#DEB887",
        stroke_width: 2,
        width: 35,
        height: 15,
      },
    ],
    fields: [],
  },
];

// Edge Templates
const edge_templates: EdgeTemplate[] = [
  // Primary Channel (Saluran Primer)
  {
    id: "saluran_primer",
    name: "Saluran Primer",
    type: "edge",
    line_type: "solid",
    line_width: 4,
    animation_flow: true,
    animation_flow_style: [
      {
        key: "flow_color",
        value: "on",
        color: "#FF0000",
        duration: 1,
      },
      {
        key: "flow_color",
        value: "off",
        color: "#00FF00",
        duration: 1,
      },
    ],
  },
  // Secondary Channel (Saluran Sekunder)
  {
    id: "saluran_sekunder_edge",
    name: "Saluran Sekunder",
    type: "edge",
    arrow_type: "arrow",
    arrow_width: 6,
    arrow_height: 6,
    line_type: "solid",
    line_width: 3,
  },
  // Tertiary Channel (Saluran Tersier)
  {
    id: "saluran_tersier",
    name: "Saluran Tersier",
    type: "edge",
    arrow_type: "arrow",
    arrow_width: 4,
    arrow_height: 4,
    line_type: "solid",
    line_width: 2,
  },
];

const templates = [...node_templates, ...edge_templates];
export default templates;
