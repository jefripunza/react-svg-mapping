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
            style={
              {
                // background: "#cbd5e1",
              }
            }
          >
            {/* Garis penghubung */}
            {links.map((link, index) => {
              const from = nodes.find((n) => n.id === link.from);
              const to = nodes.find((n) => n.id === link.to);

              // Pastikan node ditemukan sebelum menggambar garis
              if (!from || !to) return null;

              return (
                <line
                  key={index}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#003366"
                  strokeWidth="3"
                />
              );
            })}

            {/* Node titik */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="15"
                  fill="#fff"
                  stroke="#003366"
                />
                <text
                  x={node.x}
                  y={node.y - 20}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#000"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Diagram;
