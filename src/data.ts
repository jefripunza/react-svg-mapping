import type { Node, Edge, Text } from "./components/Diagram";

export const texts: Text[] = [
  {
    id: "title",
    x: 1150,
    y: 50,
    font_size: 20,
    is_bold: true,
    text_direction: "left",
    fill: "#000000",
    value: "SKEMA PEMBAGIAN AIR IRIGASI",
  },
  {
    id: "subtitle",
    x: 1200,
    y: 100,
    font_size: 30,
    is_bold: true,
    text_direction: "left",
    fill: "#000000",
    value: "DAERAH BENDUNG RENTANG",
  },
];

// Nodes - Based on the irrigation diagram
export const nodes: Node[] = [
  // Main Bendung Tabo Tabo
  {
    id: "BT0",
    label: "B.T.0",
    label_direction: "top-left",
    x: 980,
    y: 250,
    template_id: "bendung",
    data: { type: "bendung", capacity: "100 m³/s" },
  },

  // pintu air
  {
    id: "BPA1",
    label: "B.PA.1",
    label_direction: "top-left",
    x: 880,
    y: 450,
    template_id: "intake_bendung",
    data: { type: "intake_bendung" },
  },
  {
    id: "BPA2",
    label: "B.PA.2",
    label_direction: "top-right",
    x: 1060,
    y: 450,
    template_id: "intake_bendung",
    data: { type: "intake_bendung" },
  },

  // Primary Channel Gates
  {
    id: "BT1",
    label: "BT.1",
    label_direction: "top-left",
    label_x: 15,
    label_y: 10,
    x: 880,
    y: 640,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
  {
    id: "BT2",
    label: "BT.2",
    label_direction: "top",
    x: 650,
    y: 640,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },

  // Left Side - Sek. Padanglampe

  {
    id: "BP11",
    label: "B.P.11",
    label_direction: "top-right",
    label_x: -15,
    label_y: 10,
    x: 650,
    y: 870,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
  {
    id: "P15K",
    label: "P.15.K",
    label_direction: "bottom",
    x: 270,
    y: 810,
    template_id: "bangunan_ukur",
    data: { type: "bangunan_ukur" },
  },
  {
    id: "BP12",
    label: "B.P.12",
    label_direction: "top",
    x: 350,
    y: 870,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },

  // Secondary channels - Padanglampe area
  {
    id: "P31K",
    label: "P.31.K",
    label_direction: "bottom",
    x: 350,
    y: 1100,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P41K",
    label: "P.41.K",
    label_direction: "bottom",
    x: 390,
    y: 1100,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P51K",
    label: "P.51.K",
    label_direction: "bottom",
    x: 430,
    y: 1100,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P61K",
    label: "P.61.K",
    label_direction: "bottom",
    x: 470,
    y: 1100,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Main distribution points
  {
    id: "P55K",
    label: "P.55.K",
    label_direction: "bottom",
    x: 400,
    y: 700,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P43K",
    label: "P.43.K",
    label_direction: "bottom",
    x: 450,
    y: 700,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P33K",
    label: "P.33.K",
    label_direction: "bottom",
    x: 500,
    y: 700,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P13K",
    label: "P.13.K",
    label_direction: "bottom",
    x: 550,
    y: 700,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Right side distribution
  {
    id: "P1Ka",
    label: "P.1.Ka",
    label_direction: "bottom",
    x: 780,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P1Kb",
    label: "P.1.Kb",
    label_direction: "bottom",
    x: 820,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P2Ka",
    label: "P.2.Ka",
    label_direction: "bottom",
    x: 860,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P2Kb",
    label: "P.2.Kb",
    label_direction: "bottom",
    x: 900,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P3K",
    label: "P.3.K",
    label_direction: "bottom",
    x: 940,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },
  {
    id: "P4K",
    label: "P.4.K",
    label_direction: "bottom",
    x: 980,
    y: 750,
    template_id: "saluran_sekunder",
    data: { type: "saluran_sekunder" },
  },

  // Far right - Sek. Pangkajene
  {
    id: "BP5",
    label: "B.P.5",
    label_direction: "bottom",
    x: 1180,
    y: 520,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
  {
    id: "BP46",
    label: "B.P.46",
    label_direction: "bottom",
    x: 1220,
    y: 520,
    template_id: "pintu_air",
    data: { type: "pintu_air" },
  },
];

// Edges - Water flow connections
export const edges: Edge[] = [
  // Main flow from Bendung
  {
    id: "BT0-BPA1",
    from: "BT0",
    to: "BPA1",
    template_id: "saluran_primer",
    data: { flow_color: "off", flow_direction: "down" },
  },
  {
    id: "BT0-BPA2",
    from: "BT0",
    to: "BPA2",
    template_id: "saluran_primer",
    data: { flow_color: "off", flow_direction: "down" },
  },

  {
    id: "BPA1-BT1",
    from: "BPA1",
    to: "BT1",
    template_id: "saluran_primer",
    data: { flow_direction: "down" },
  },

  {
    id: "BT1-BT2",
    from: "BT1",
    to: "BT2",
    template_id: "saluran_primer",
    data: { flow_direction: "down" },
  },

  // Left side - Padanglampe distribution
  {
    id: "BT2-BP11",
    from: "BT2",
    to: "BP11",
    template_id: "saluran_primer",
    data: { flow_direction: "left" },
  },
  {
    id: "BP11-BP12",
    from: "BP11",
    to: "BP12",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "left" },
  },
  {
    id: "BP12-P15K",
    from: "BP12",
    to: "P15K",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "right" },
  },

  // Secondary distribution - Padanglampe
  {
    id: "BP12-P31K",
    from: "BP12",
    to: "P31K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P31K-P41K",
    from: "P31K",
    to: "P41K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P41K-P51K",
    from: "P41K",
    to: "P51K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P51K-P61K",
    from: "P51K",
    to: "P61K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  // Main distribution line
  {
    id: "BP11-P13K",
    from: "BP11",
    to: "P13K",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "down-right" },
  },
  {
    id: "P55K-P43K",
    from: "P55K",
    to: "P43K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P43K-P33K",
    from: "P43K",
    to: "P33K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P33K-P13K",
    from: "P33K",
    to: "P13K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  {
    id: "BT2-P1Ka",
    from: "BT2",
    to: "P1Ka",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "down-right" },
  },

  // Right side distribution
  {
    id: "BT3-P1Ka",
    from: "BT3",
    to: "P1Ka",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "down-right" },
  },
  {
    id: "P1Ka-P1Kb",
    from: "P1Ka",
    to: "P1Kb",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P1Kb-P2Ka",
    from: "P1Kb",
    to: "P2Ka",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P2Ka-P2Kb",
    from: "P2Ka",
    to: "P2Kb",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P2Kb-P3K",
    from: "P2Kb",
    to: "P3K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
  {
    id: "P3K-P4K",
    from: "P3K",
    to: "P4K",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },

  // Far right - Pangkajene
  {
    id: "P4K-BP5",
    from: "P4K",
    to: "BP5",
    template_id: "saluran_sekunder_edge",
    data: { flow_direction: "right" },
  },
  {
    id: "BP5-BP46",
    from: "BP5",
    to: "BP46",
    template_id: "saluran_tersier",
    data: { flow_direction: "right" },
  },
];
