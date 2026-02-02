import React from "react";
import "./Chat.css";

const colorFor = (label) => {
  if(!label) return {bg:"#eee", text:"#222"};
  if(label.includes("Severe")) return {bg:"#ff5c6c", text:"#fff"};
  if(label.includes("Moderately severe") || label.includes("Moderate")) return {bg:"#ff9f43", text:"#111"};
  if(label.includes("Mild")) return {bg:"#40c4a6", text:"#fff"};
  return {bg:"#9ad3bc", text:"#111"};
};

export default function SeverityCard({ result, onClose }){
  const { score, label, type } = result || {};
  const c = colorFor(label);
  return (
    <div className="severity-wrap">
      <div className="severity-card" style={{ background:c.bg, color:c.text }}>
        <div className="score">{score}</div>
        <div className="meta">
          <div className="type">{type}</div>
          <div className="label">{label}</div>
        </div>
        <div className="actions">
          <button className="ghost" onClick={onClose}>Close</button>
          <button className="primary">Find resources</button>
        </div>
      </div>
    </div>
  );
}
