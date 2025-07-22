import type {
  Node,
  Link,
  NodeTemplate,
  LinkTemplate,
} from "./components/Diagram";

export const node_templates: NodeTemplate[] = [
  {
    id: "B.T.0",
    name: "Bendung Tabo Tabo",
    type: "node",
    objects: [
      {
        type: "circle",
        fill: "#fff",
        stroke: "#003366",
        strokeWidth: 3,
        cx: 100,
        cy: 100,
        r: 50,
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
];
export const link_templates: LinkTemplate[] = [
  {
    id: "L.T.0",
    name: "Link Tabo Tabo",
    type: "link",
    arrowType: "arrow",
    arrowWidth: 10,
    arrowHeight: 10,
    lineType: "solid",
    lineWidth: 3,
    animationFlow: true,
  },
];
export const templates = [...node_templates, ...link_templates];

export const nodes: Node[] = [
  {
    id: "B.T.0",
    label: "Bendung Tabo Tabo",
    labelDirection: "bottom",
    x: 100,
    y: 100,
    template_id: "B.T.0",
    data: { type: "bendung" },
  },
  {
    id: "B.T.1",
    label: "T.1 ka",
    labelDirection: "bottom",
    x: 100,
    y: 200,
    template_id: "B.T.1",
    data: { type: "tangki" },
  },
  {
    id: "B.T.2",
    label: "T.2 ki",
    labelDirection: "bottom",
    x: 100,
    y: 300,
    template_id: "B.T.2",
    data: { type: "tangki" },
  },
  // dan seterusnya
];

export const links: Link[] = [
  { from: "B.T.0", to: "B.T.1", template_id: "L.T.0", data: { type: "link" } },
  { from: "B.T.1", to: "B.T.2", template_id: "L.T.1", data: { type: "link" } },
];
