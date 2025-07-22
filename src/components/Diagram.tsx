import React from "react";
import type { Node, Link } from "../types/diagram";

type DiagramProps = {
  nodes: Node[];
  links: Link[];
};

const Diagram: React.FC<DiagramProps> = ({ nodes, links }) => {
  return (
    <svg width="2000" height="2000" style={{ background: "#cbd5e1" }}>
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
          <circle cx={node.x} cy={node.y} r="15" fill="#fff" stroke="#003366" />
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
  );
};

export default Diagram;
