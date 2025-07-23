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
export type EdgeTemplateAnimationStyle = {
  key: string;
  value: string | number | boolean;
  color: string;
  duration: number;
};
export type EdgeTemplate = {
  id: string;
  name: string;
  type: "edge";

  // arrow
  arrowType?: ArrowType;
  arrowWidth?: number;
  arrowHeight?: number;

  // line
  lineType?: LineType;
  lineWidth?: number;

  // animation flow
  animationFlow?: boolean;
  animationFlowStyle?: EdgeTemplateAnimationStyle[];
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
export type Edge = {
  id: string;
  from: string;
  to: string;
  template_id: string;
  data: Record<string, unknown>;
  // meta
  animation_style?: string;
};

type DiagramProps = {
  templates: (NodeTemplate | EdgeTemplate)[];
  nodes: Node[];
  edges: Edge[];
  texts?: Text[];
};
const Diagram: React.FC<DiagramProps> = ({
  templates,
  nodes,
  edges,
  texts = [],
}) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
    setModalOpen(true);
  };

  const handleEdgeClick = (edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
    setModalOpen(true);
  };
  // Helper functions
  const getNodeTemplate = (templateId: string): NodeTemplate | undefined => {
    return templates.find(
      (t) => t.id === templateId && t.type === "node"
    ) as NodeTemplate;
  };

  const getEdgeTemplate = (templateId: string): EdgeTemplate | undefined => {
    return templates.find(
      (t) => t.id === templateId && t.type === "edge"
    ) as EdgeTemplate;
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
    template: EdgeTemplate
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

            {/* Render Edges */}
            {edges.map((edge, index) => {
              const from = nodes.find((n) => n.id === edge.from);
              const to = nodes.find((n) => n.id === edge.to);
              const template = getEdgeTemplate(edge.template_id);

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
                (style) => edge.data[style.key] === style.value
              );

              return (
                <g
                  key={`edge-${index}`}
                  onClick={() => handleEdgeClick(edge)}
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
                        <g key={`edge-flow-${index}`}>
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
      <ChatAiModal />
      <DetailsModal
        templates={templates}
        nodes={nodes}
        edges={edges}
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};

export default Diagram;

interface LegendModalProps {
  templates: (NodeTemplate | EdgeTemplate)[];
}
const LegendModal: React.FC<LegendModalProps> = ({ templates }) => {
  const [legendOpen, setLegendOpen] = useState(false);
  return (
    <Dialog
      open={legendOpen}
      onOpenChange={setLegendOpen}
      direction="bottom-left"
      useOverlay={false}
    >
      <DialogTrigger asChild>
        <button
          className="fixed bottom-4 left-4 z-10 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-lime-500"
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

          {/* Edge Templates Legend */}
          <div>
            <h3 className="text-lg font-medium mb-2">Edges</h3>
            <div className="space-y-3">
              {templates
                .filter((template) => template.type === "edge")
                .map((template, index) => {
                  const edgeTemplate = template as EdgeTemplate;
                  return (
                    <div
                      key={`edge-legend-${index}`}
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
                            strokeWidth={edgeTemplate.lineWidth || 1}
                            strokeDasharray={
                              edgeTemplate.lineType === "dashed"
                                ? "4 2"
                                : undefined
                            }
                          />
                          {(edgeTemplate.arrowType === "arrow" ||
                            edgeTemplate.arrowType === "arrowhead") && (
                            <polygon
                              points="35,20 30,17 30,23"
                              fill="#335577"
                            />
                          )}
                        </svg>
                      </div>
                      <span>{edgeTemplate.name || edgeTemplate.id}</span>
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
  templates: (NodeTemplate | EdgeTemplate)[];
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}
const DetailsModal: React.FC<DetailsModalProps> = ({
  templates,
  nodes,
  edges,
  selectedNode,
  selectedEdge,
  modalOpen,
  setModalOpen,
}) => {
  const nodeTemplate = templates.find(
    (template) => template.id === selectedNode?.template_id
  );
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
              ? `Node: ${nodeTemplate?.name} (${selectedNode.label})`
              : selectedEdge
              ? "Edge Information"
              : "Information"}
          </DialogTitle>
          <DialogDescription>
            {selectedNode
              ? "Node details and properties"
              : selectedEdge
              ? "Edge details and properties"
              : "Details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {selectedNode &&
            (() => {
              // Find incoming and outgoing edges
              const edgesFrom = edges.filter(
                (edge) => edge.from === selectedNode.id
              );
              const edgesTo = edges.filter(
                (edge) => edge.to === selectedNode.id
              );

              // Find connected nodes
              const previousNodes = edgesTo.map((edge) => {
                const node = nodes.find((node) => node.id === edge.from);
                const nodeTemplate = templates.find(
                  (template) => template.id === node?.template_id
                );
                return {
                  edgeId: edge.id,
                  templateName: nodeTemplate?.name,
                  nodeId: node?.id,
                  nodeLabel: node?.label,
                };
              });

              const nextNodes = edgesFrom.map((edge) => {
                const node = nodes.find((node) => node.id === edge.to);
                const nodeTemplate = templates.find(
                  (template) => template.id === node?.template_id
                );
                return {
                  edgeId: edge.id,
                  templateName: nodeTemplate?.name,
                  nodeId: node?.id,
                  nodeLabel: node?.label,
                };
              });

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

                  {previousNodes.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Previous Nodes:</span>
                      <ul className="space-y-1">
                        {previousNodes.map((item) => (
                          <li key={item.edgeId} className="text-sm">
                            <span className="font-medium">
                              {item.nodeLabel}
                            </span>
                            <span className="text-gray-500 text-xs block">
                              via {item.templateName} ({item.edgeId})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nextNodes.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="font-medium">Next Nodes:</span>
                      <ul className="space-y-1">
                        {nextNodes.map((item) => (
                          <li key={item.edgeId} className="text-sm">
                            <span className="font-medium">
                              {item.nodeLabel}
                            </span>
                            <span className="text-gray-500 text-xs block">
                              via {item.templateName} ({item.edgeId})
                            </span>
                          </li>
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

          {selectedEdge &&
            (() => {
              const nodeFrom = nodes.find(
                (node) => node.id === selectedEdge.from
              );
              const nodeTo = nodes.find((node) => node.id === selectedEdge.to);
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
                  {Object.keys(selectedEdge.data).length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium">Data:</span>
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <pre>{JSON.stringify(selectedEdge.data, null, 2)}</pre>
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

interface ChatAiModalProps {}
const ChatAiModal: React.FC<ChatAiModalProps> = ({}) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ id: string; type: "user" | "ai"; content: string; timestamp: Date }>
  >([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user" as const,
      content: prompt.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: "ai" as const,
        content: `This is a simulated AI response to: "${userMessage.content}". In a real implementation, this would connect to Ollama or another AI service.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={chatOpen}
      onOpenChange={setChatOpen}
      direction="right"
      useOverlay={false}
      height={1000}
      header={
        <DialogHeader>
          <DialogTitle>AI Chat Assistant</DialogTitle>
          <DialogDescription>
            Ask questions about the diagram or get help with analysis
          </DialogDescription>
        </DialogHeader>
      }
      footer={
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              disabled={isLoading}
              className="flex-1 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9"></polygon>
              </svg>
            </button>
          </div>
        </div>
      }
    >
      <DialogTrigger asChild>
        <button
          className="fixed bottom-4 right-4 z-10 bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setChatOpen(true)}
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] h-[600px] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with the AI assistant!</p>
              <p className="text-sm mt-2">
                Ask about nodes, edges, or diagram analysis.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
