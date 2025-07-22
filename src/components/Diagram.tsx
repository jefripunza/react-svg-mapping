/**
 * Diagram Component
 * Author: Jefri Herdi Triyanto
 * Version: 1.0.0
 * Contact: jefriherditriyanto@gmail.com
 */

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

export type Text = {
  x: number;
  y: number;
  fontSize: number;
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
  stroke: string;
  strokeWidth: number;

  // circle
  cx?: number;
  cy?: number;
  r?: number;

  // rect
  width?: number;
  height?: number;
};
export type NodeTemplate = {
  id: string;
  name: string;
  type: "node";

  field: Field[];
  objects: NodeTemplateObject[];
};

export type Node = {
  id: string;
  label: string;
  labelDirection: Direction;
  x: number;
  y: number;
  template_id: string;
  data: Record<string, unknown>;
};
export type LinkTemplate = {
  id: string;
  name: string;
  type: "link";

  // arrow
  arrowType?: "none" | "arrow" | "arrowhead";
  arrowWidth?: number;
  arrowHeight?: number;

  // line
  lineType?: "solid" | "dashed" | "dotted";
  lineWidth?: number;

  // animation flow
  animationFlow?: boolean;
};
export type Link = {
  from: string;
  to: string;
  template_id: string;
  data: Record<string, unknown>;
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
  texts,
}) => {
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
    offset: number = 25
  ) => {
    switch (direction) {
      case "top":
        return { x, y: y - offset };
      case "bottom":
        return { x, y: y + offset };
      case "left":
        return { x: x - offset, y };
      case "right":
        return { x: x + offset, y };
      case "top-left":
        return { x: x - offset, y: y - offset };
      case "top-right":
        return { x: x + offset, y: y - offset };
      case "bottom-left":
        return { x: x - offset, y: y + offset };
      case "bottom-right":
        return { x: x + offset, y: y + offset };
      default:
        return { x, y: y - offset };
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
    const arrowHeight = template.arrowHeight || 10;

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
    <div className="zoom-container">
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
          <svg
            width="2000"
            height="2000"
            style={{
              // background: "#cbd5e1",
            }}
          >
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

              return (
                <g key={`link-${index}`}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    {...strokeProps}
                  />
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
                <g key={`node-${node.id}`}>
                  {/* Render template objects */}
                  {template.objects.map((obj, objIndex) => {
                    const objProps = {
                      fill: obj.fill,
                      stroke: obj.stroke,
                      strokeWidth: obj.strokeWidth,
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
                      return (
                        <rect
                          key={`obj-${objIndex}`}
                          x={node.x - width / 2}
                          y={node.y - height / 2}
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
                          points={points.map((p) => `${p[0]},${p[1]}`).join(" ")}
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
    </div>
  );
};

export default Diagram;
