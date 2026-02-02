import React, { useEffect } from "react";
import "./OpeningAnimation.css";

export default function OpeningAnimation({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(), 2200); // show for 2.2s
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="opening-wrap">
      <div className="logo-card">
        <div className="logo-circle">MM</div>
        <div className="app-title">
          <div className="brand">MindMate</div>
          <div className="tag">Gentle, private check-ins</div>
        </div>
      </div>
      <div className="sparkles" />
    </div>
  );
}
