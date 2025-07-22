import type { NodeTemplate, LinkTemplate } from "./components/Diagram";

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
        strokeWidth: 3,
        width: 48,
        height: 48,
      },
    ],
    field: [
      {
        id: "type",
        key: "type",
        type: "string",
        value: "bendung",
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
        strokeWidth: 2,
        r: 12,
      },
    ],
    field: [
      {
        id: "type",
        key: "type",
        type: "string",
        value: "pintu_air",
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
        strokeWidth: 2,
        width: 40,
        height: 20,
      },
    ],
    field: [
      {
        id: "type",
        key: "type",
        type: "string",
        value: "bangunan_ukur",
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
        strokeWidth: 2,
        width: 35,
        height: 15,
      },
    ],
    field: [
      {
        id: "type",
        key: "type",
        type: "string",
        value: "saluran_sekunder",
      },
    ],
  },
];

// Link Templates
const link_templates: LinkTemplate[] = [
  // Primary Channel (Saluran Primer)
  {
    id: "saluran_primer",
    name: "Saluran Primer",
    type: "link",
    lineType: "solid",
    lineWidth: 4,
    animationFlow: true,
    animationFlowStyle: [
      {
        key: "flow_1",
        color: "#FF0000",
      },
      {
        key: "flow_2",
        color: "#00FF00",
      },
    ],
  },
  // Secondary Channel (Saluran Sekunder)
  {
    id: "saluran_sekunder_link",
    name: "Saluran Sekunder",
    type: "link",
    arrowType: "arrow",
    arrowWidth: 6,
    arrowHeight: 6,
    lineType: "solid",
    lineWidth: 3,
  },
  // Tertiary Channel (Saluran Tersier)
  {
    id: "saluran_tersier",
    name: "Saluran Tersier",
    type: "link",
    arrowType: "arrow",
    arrowWidth: 4,
    arrowHeight: 4,
    lineType: "solid",
    lineWidth: 2,
  },
];

const templates = [...node_templates, ...link_templates];
export default templates;
