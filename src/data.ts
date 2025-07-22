import type { Node, Link } from "./components/Diagram";

// Nodes - Based on the irrigation diagram
export const nodes: Node[] = [
  // Main Bendung Tabo Tabo
  {
    id: "BT0",
    label: "B.T.0",
    labelDirection: "left",
    x: 650,
    y: 100,
    template_id: "bendung",
    data: { type: "bendung", capacity: "100 m³/s" },
  },

  // Primary Channel Gates
  {
    id: "BT1",
    label: "BT.1",
    labelDirection: "left",
    x: 620,
    y: 160,
    template_id: "bangunan_ukur",
    data: { type: "bangunan_ukur", flow: "15 m³/s" },
  },
  {
    id: "BT3",
    label: "BT.3",
    labelDirection: "right",
    x: 650,
    y: 250,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },

  // Left Side - Sek. Padanglampe
  {
    id: "BP12",
    label: "B.P.12",
    labelDirection: "bottom",
    x: 30,
    y: 270,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
  {
    id: "P15K",
    label: "P.15.K",
    labelDirection: "bottom",
    x: 120,
    y: 310,
    template_id: "bangunan_ukur",
    data: { type: "bangunan_ukur" },
  },
  {
    id: "BP11",
    label: "B.P.11",
    labelDirection: "top",
    x: 150,
    y: 320,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },

  // Secondary channels - Padanglampe area
  {
    id: "P31K",
    label: "P.31.K",
    labelDirection: "bottom",
    x: 180,
    y: 300,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P41K",
    label: "P.41.K",
    labelDirection: "bottom",
    x: 220,
    y: 300,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P51K",
    label: "P.51.K",
    labelDirection: "bottom",
    x: 260,
    y: 300,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P61K",
    label: "P.61.K",
    labelDirection: "bottom",
    x: 300,
    y: 300,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Main distribution points
  {
    id: "P55K",
    label: "P.55.K",
    labelDirection: "bottom",
    x: 400,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P43K",
    label: "P.43.K",
    labelDirection: "bottom",
    x: 450,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P33K",
    label: "P.33.K",
    labelDirection: "bottom",
    x: 500,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P13K",
    label: "P.13.K",
    labelDirection: "bottom",
    x: 550,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Right side distribution
  {
    id: "P1Ka",
    label: "P.1.Ka",
    labelDirection: "bottom",
    x: 680,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P1Kb",
    label: "P.1.Kb",
    labelDirection: "bottom",
    x: 720,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P2Ka",
    label: "P.2.Ka",
    labelDirection: "bottom",
    x: 760,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P2Kb",
    label: "P.2.Kb",
    labelDirection: "bottom",
    x: 800,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P3K",
    label: "P.3.K",
    labelDirection: "bottom",
    x: 840,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P4K",
    label: "P.4.K",
    labelDirection: "bottom",
    x: 880,
    y: 350,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Far right - Sek. Pangkajene
  {
    id: "BP5",
    label: "B.P.5",
    labelDirection: "bottom",
    x: 950,
    y: 320,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
  {
    id: "BP46",
    label: "B.P.46",
    labelDirection: "bottom",
    x: 990,
    y: 320,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
];

// Links - Water flow connections
export const links: Link[] = [
  // Main flow from Bendung
  {
    from: "BT0",
    to: "BT1",
    template_id: "saluran_primer",
    data: { flow_color: "on", flow_direction: "down" },
  },
  {
    from: "BT1",
    to: "BT3",
    template_id: "saluran_primer",
    data: { flow_direction: "down" },
  },

  // Left side - Padanglampe distribution
  {
    from: "BT3",
    to: "BP12",
    template_id: "saluran_primer",
    data: { flow_direction: "left" },
  },
  {
    from: "BP12",
    to: "P15K",
    template_id: "saluran_sekunder_link",
    data: { flow_direction: "right" },
  },
  {
    from: "P15K",
    to: "BP11",
    template_id: "saluran_sekunder_link",
    data: { flow_direction: "right" },
  },

  // Secondary distribution - Padanglampe
  {
    from: "BP11",
    to: "P31K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P31K",
    to: "P41K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P41K",
    to: "P51K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P51K",
    to: "P61K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  // Main distribution line
  {
    from: "P61K",
    to: "P55K",
    template_id: "saluran_sekunder_link",
    data: { flow_direction: "down-right" },
  },
  {
    from: "P55K",
    to: "P43K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P43K",
    to: "P33K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P33K",
    to: "P13K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  // Right side distribution
  {
    from: "BT3",
    to: "P1Ka",
    template_id: "saluran_sekunder_link",
    data: { flow_direction: "down-right" },
  },
  {
    from: "P1Ka",
    to: "P1Kb",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P1Kb",
    to: "P2Ka",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P2Ka",
    to: "P2Kb",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P2Kb",
    to: "P3K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    from: "P3K",
    to: "P4K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  // Far right - Pangkajene
  {
    from: "P4K",
    to: "BP5",
    template_id: "saluran_sekunder_link",
    data: { flow_direction: "right" },
  },
  {
    from: "BP5",
    to: "BP46",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
];
