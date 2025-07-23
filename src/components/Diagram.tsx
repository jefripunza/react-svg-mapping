/**
 * Diagram Component
 * Author: Jefri Herdi Triyanto
 * Version: 1.0.0
 * Contact: jefriherditriyanto@gmail.com
 */

import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export type Direction =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
export type TextDirection = "top" | "bottom" | "left" | "right";
export type FieldType = "string" | "number" | "boolean";
export type ObjectType = "circle" | "rect" | "triangle";
export type ArrowType = "none" | "arrow" | "arrowhead";
export type LineType = "solid" | "dashed" | "dotted";

export type Text = {
  id: string;
  x: number;
  y: number;
  fontSize: number;
  isBold?: boolean;
  textDirection: TextDirection;
  fill: string;
  value: string;
};
export type Field = {
  id: string;
  key: string;
  type: FieldType;
  value: string | number | boolean;
};

// Template
export type NodeTemplateObject = {
  type: ObjectType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;

  // circle
  r?: number; // triangle

  // rect
  width?: number;
  height?: number;
  x?: number;
  y?: number;
};
export type NodeTemplate = {
  id: string;
  name: string;
  type: "node";

  fields: Field[];
  objects: NodeTemplateObject[];
};
export type LinkTemplateAnimationStyle = {
  key: string;
  value: string | number | boolean;
  color: string;
  duration: number;
};
export type LinkTemplate = {
  id: string;
  name: string;
  type: "link";

  // arrow
  arrowType?: ArrowType;
  arrowWidth?: number;
  arrowHeight?: number;

  // line
  lineType?: LineType;
  lineWidth?: number;

  // animation flow
  animationFlow?: boolean;
  animationFlowStyle?: LinkTemplateAnimationStyle[];
};

// data
export type Node = {
  id: string;
  label: string;
  labelDirection: Direction;
  labelMargin?: number;
  x: number;
  y: number;
  template_id: string;
  data: Record<string, unknown>;
};
export type Link = {
  id: string;
  from: string;
  to: string;
  template_id: string;
  data: Record<string, unknown>;
  // meta
  animation_style?: string;
};

type DiagramProps = {
  templates: (NodeTemplate | LinkTemplate)[];
  nodes: Node[];
  links: Link[];
  texts?: Text[];
};
const Diagram: React.FC<DiagramProps> = ({
  templates,
  nodes,
  links,
  texts = [],
}) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setSelectedLink(null);
    setModalOpen(true);
  };

  const handleLinkClick = (link: Link) => {
    setSelectedLink(link);
    setSelectedNode(null);
    setModalOpen(true);
  };
  // Helper functions
  const getNodeTemplate = (templateId: string): NodeTemplate | undefined => {
    return templates.find(
      (t) => t.id === templateId && t.type === "node"
    ) as NodeTemplate;
  };

  const getLinkTemplate = (templateId: string): LinkTemplate | undefined => {
    return templates.find(
      (t) => t.id === templateId && t.type === "link"
    ) as LinkTemplate;
  };

  const getLabelPosition = (
    x: number,
    y: number,
    direction: Direction,
    offset: number = 25,
    margin: number = 10
  ) => {
    switch (direction) {
      case "top":
        return { x, y: y - offset - margin };
      case "bottom":
        return { x, y: y + offset + margin };
      case "left":
        return { x: x - offset - margin, y };
      case "right":
        return { x: x + offset + margin, y };
      case "top-left":
        return { x: x - offset - margin, y: y - offset };
      case "top-right":
        return { x: x + offset + margin, y: y - offset };
      case "bottom-left":
        return { x: x - offset - margin, y: y + offset };
      case "bottom-right":
        return { x: x + offset + margin, y: y + offset };
      default:
        return { x, y: y - offset - margin };
    }
  };

  const getTextAnchor = (direction: Direction): string => {
    if (direction.includes("left")) return "end";
    if (direction.includes("right")) return "start";
    return "middle";
  };

  const renderArrow = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    template: LinkTemplate
  ) => {
    if (!template.arrowType || template.arrowType === "none") return null;

    const arrowWidth = template.arrowWidth || 10;
    // const arrowHeight = template.arrowHeight || 10;

    // Calculate arrow position and angle
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowX = x2 - Math.cos(angle) * 15; // Offset from node edge
    const arrowY = y2 - Math.sin(angle) * 15;

    const arrowPoints = [
      [arrowX, arrowY],
      [
        arrowX - arrowWidth * Math.cos(angle - Math.PI / 6),
        arrowY - arrowWidth * Math.sin(angle - Math.PI / 6),
      ],
      [
        arrowX - arrowWidth * Math.cos(angle + Math.PI / 6),
        arrowY - arrowWidth * Math.sin(angle + Math.PI / 6),
      ],
    ];

    return (
      <polygon
        points={arrowPoints.map((p) => `${p[0]},${p[1]}`).join(" ")}
        fill="#003366"
      />
    );
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-300">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
        panning={{
          disabled: false,
          velocityDisabled: false,
        }}
        wheel={{
          disabled: false,
        }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
          contentStyle={{
            width: "100%",
            height: "100%",
            // background: "#cbd5e1",
          }}
        >
          <svg width="2000" height="2000">
            {/* Define patterns for dashed/dotted lines */}
            <defs>
              <pattern
                id="dashed"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
              >
                <rect width="5" height="10" fill="#003366" />
              </pattern>
              <pattern
                id="dotted"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
              >
                <circle cx="3" cy="3" r="1" fill="#003366" />
              </pattern>
            </defs>

            {/* Render Links */}
            {links.map((link, index) => {
              const from = nodes.find((n) => n.id === link.from);
              const to = nodes.find((n) => n.id === link.to);
              const template = getLinkTemplate(link.template_id);

              // Skip if nodes or template not found
              if (!from || !to || !template) return null;

              const lineWidth = template.lineWidth || 3;
              let strokeProps: any = {
                stroke: "#003366",
                strokeWidth: lineWidth,
              };

              // Apply line style
              if (template.lineType === "dashed") {
                strokeProps.strokeDasharray = "10,5";
              } else if (template.lineType === "dotted") {
                strokeProps.strokeDasharray = "2,3";
              }

              const animationFlowStyle = template.animationFlowStyle || [];
              const animationFlowStyleSelected = animationFlowStyle.find(
                (style) => link.data[style.key] === style.value
              );

              return (
                <g
                  key={`link-${index}`}
                  onClick={() => handleLinkClick(link)}
                  style={{ cursor: "pointer" }}
                >
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    {...strokeProps}
                  />

                  {/* Animated flow overlay if enabled */}
                  {template.animationFlow &&
                    template.animationFlowStyle &&
                    animationFlowStyleSelected && (
                      <g>
                        {/* Moving dash animation */}
                        <g key={`link-flow-${index}`}>
                          <line
                            x1={from.x}
                            y1={from.y}
                            x2={to.x}
                            y2={to.y}
                            stroke={animationFlowStyleSelected.color}
                            strokeWidth={lineWidth + 1}
                            strokeLinecap="round"
                            strokeDasharray="20 10"
                            strokeDashoffset="0"
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              values="30;0"
                              dur={
                                animationFlowStyleSelected.duration
                                  ? `${animationFlowStyleSelected.duration}s`
                                  : "1s"
                              }
                              repeatCount="indefinite"
                            />
                          </line>
                        </g>
                      </g>
                    )}

                  {/* Render arrow if specified */}
                  {renderArrow(from.x, from.y, to.x, to.y, template)}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const template = getNodeTemplate(node.template_id);
              if (!template) return null;

              const labelPos = getLabelPosition(
                node.x,
                node.y,
                node.labelDirection
              );
              const textAnchor = getTextAnchor(node.labelDirection);

              return (
                <g
                  key={`node-${node.id}`}
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Render template objects */}
                  {template.objects.map((obj, objIndex) => {
                    const objProps = {
                      fill: obj.fill,
                      stroke: obj.stroke || "none",
                      strokeWidth: obj.strokeWidth || 0,
                    };

                    if (obj.type === "circle") {
                      return (
                        <circle
                          key={`obj-${objIndex}`}
                          cx={node.x}
                          cy={node.y}
                          r={obj.r || 15}
                          {...objProps}
                        />
                      );
                    } else if (obj.type === "rect") {
                      const width = obj.width || 30;
                      const height = obj.height || 30;
                      const extraX = obj.x || 0;
                      const extraY = obj.y || 0;
                      return (
                        <rect
                          key={`obj-${objIndex}`}
                          x={node.x - width / 2 + extraX}
                          y={node.y - height / 2 + extraY}
                          width={width}
                          height={height}
                          {...objProps}
                        />
                      );
                    } else if (obj.type === "triangle") {
                      const size = obj.r || 15;
                      const points = [
                        [node.x, node.y - size],
                        [node.x - size, node.y + size],
                        [node.x + size, node.y + size],
                      ];
                      return (
                        <polygon
                          key={`obj-${objIndex}`}
                          points={points
                            .map((p) => `${p[0]},${p[1]}`)
                            .join(" ")}
                          {...objProps}
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Render node label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fontSize="12"
                    textAnchor={textAnchor}
                    fill="#000"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

            {/* Render custom texts */}
            {texts?.map((text, index) => {
              const textPos = getLabelPosition(
                text.x,
                text.y,
                text.textDirection,
                0
              );
              const textAnchor = getTextAnchor(text.textDirection);

              return (
                <text
                  key={`text-${index}`}
                  x={textPos.x}
                  y={textPos.y}
                  fontSize={text.fontSize}
                  fontWeight={text.isBold ? "bold" : "normal"}
                  textAnchor={textAnchor}
                  fill={text.fill}
                >
                  {text.value}
                </text>
              );
            })}
          </svg>
        </TransformComponent>
      </TransformWrapper>

      <LegendModal templates={templates} />
      <DetailsModal
        nodes={nodes}
        links={links}
        selectedNode={selectedNode}
        selectedLink={selectedLink}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default Diagram;

interface LegendModalProps {
  templates: (NodeTemplate | LinkTemplate)[];
}
const LegendModal: React.FC<LegendModalProps> = ({ templates }) => {
  const [legendOpen, setLegendOpen] = useState(false);
  return (
    <Dialog
      open={legendOpen}
      onOpenChange={setLegendOpen}
      direction="right"
      useOverlay={false}
    >
      <DialogTrigger asChild>
        <button
          className="fixed top-20 right-4 z-10 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lime-500"
          onClick={() => setLegendOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Legend</DialogTitle>
          <DialogDescription>
            Diagram elements and their meanings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Node Templates Legend */}
          <div>
            <h3 className="text-lg font-medium mb-2">Nodes</h3>
            <div className="space-y-3">
              {templates
                .filter((template) => template.type === "node")
                .map((template, index) => {
                  const nodeTemplate = template as NodeTemplate;
                  return (
                    <div
                      key={`node-legend-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 flex-shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          {nodeTemplate.objects.map((obj, objIndex) => {
                            if (obj.type === "circle") {
                              return (
                                <circle
                                  key={`legend-node-${template.id}-${objIndex}`}
                                  cx={20}
                                  cy={20}
                                  r={obj.r || 10}
                                  fill={obj.fill}
                                  stroke={obj.stroke}
                                  strokeWidth={obj.strokeWidth}
                                />
                              );
                            } else if (obj.type === "rect") {
                              return (
                                <rect
                                  key={`legend-node-${template.id}-${objIndex}`}
                                  x={20 - (obj.width || 20) / 2}
                                  y={20 - (obj.height || 20) / 2}
                                  width={obj.width || 20}
                                  height={obj.height || 20}
                                  fill={obj.fill}
                                  stroke={obj.stroke}
                                  strokeWidth={obj.strokeWidth}
                                />
                              );
                            }
                            return null;
                          })}
                        </svg>
                      </div>
                      <span>{nodeTemplate.name || nodeTemplate.id}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Link Templates Legend */}
          <div>
            <h3 className="text-lg font-medium mb-2">Links</h3>
            <div className="space-y-3">
              {templates
                .filter((template) => template.type === "link")
                .map((template, index) => {
                  const linkTemplate = template as LinkTemplate;
                  return (
                    <div
                      key={`link-legend-${index}`}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 flex-shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                          <line
                            x1={5}
                            y1={20}
                            x2={35}
                            y2={20}
                            stroke="#335577"
                            strokeWidth={linkTemplate.lineWidth || 1}
                            strokeDasharray={
                              linkTemplate.lineType === "dashed"
                                ? "4 2"
                                : undefined
                            }
                          />
                          {(linkTemplate.arrowType === "arrow" ||
                            linkTemplate.arrowType === "arrowhead") && (
                            <polygon
                              points="35,20 30,17 30,23"
                              fill="#335577"
                            />
                          )}
                        </svg>
                      </div>
                      <span>{linkTemplate.name || linkTemplate.id}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DetailsModalProps {
  nodes: Node[];
  links: Link[];
  selectedNode: Node | null;
  selectedLink: Link | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}
const DetailsModal: React.FC<DetailsModalProps> = ({
  nodes,
  links,
  selectedNode,
  selectedLink,
  modalOpen,
  setModalOpen,
}) => {
  return (
    <Dialog
      open={modalOpen}
      direction="left"
      onOpenChange={setModalOpen}
      useOverlay={false}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedNode
              ? `Node: ${selectedNode.label}`
              : selectedLink
              ? "Link Information"
              : "Information"}
          </DialogTitle>
          <DialogDescription>
            {selectedNode
              ? "Node details and properties"
              : selectedLink
              ? "Link details and properties"
              : "Details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {selectedNode &&
            (() => {
              const linkFrom = links.filter(
                (link) => link.from === selectedNode.id
              );
              const linkTo = links.filter(
                (link) => link.to === selectedNode.id
              );
              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">ID:</span>
                    <span>{selectedNode.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Label:</span>
                    <span>{selectedNode.label}</span>
                  </div>
                  {linkFrom.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">From:</span>
                      <ul>
                        {linkFrom.map((link) => (
                          <li key={link.id}>{link.from}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {linkTo.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">To:</span>
                      <ul>
                        {linkTo.map((link) => (
                          <li key={link.id}>{link.to}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Object.keys(selectedNode.data).length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium">Data:</span>
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <pre>{JSON.stringify(selectedNode.data, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          {selectedLink &&
            (() => {
              const nodeFrom = nodes.find(
                (node) => node.id === selectedLink.from
              );
              const nodeTo = nodes.find((node) => node.id === selectedLink.to);
              return (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">From:</span>
                    <span>{nodeFrom?.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">To:</span>
                    <span>{nodeTo?.label}</span>
                  </div>
                  {Object.keys(selectedLink.data).length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium">Data:</span>
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <pre>{JSON.stringify(selectedLink.data, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
