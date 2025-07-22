import type { Node, Link } from "./types/diagram";

export const nodes: Node[] = [
  { id: "B.T.0", label: "Bendung Tabo Tabo", x: 100, y: 100 },
  { id: "B.T.1", label: "T.1 ka", x: 100, y: 200 },
  { id: "B.T.2", label: "T.2 ki", x: 100, y: 300 },
  // dan seterusnya
];

export const links: Link[] = [
  { from: "B.T.0", to: "B.T.1" },
  { from: "B.T.1", to: "B.T.2" },
];
