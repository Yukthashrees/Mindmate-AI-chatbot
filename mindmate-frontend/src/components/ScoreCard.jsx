// src/components/ScoreCard.jsx
import React, { useEffect } from "react";

/**
 Props:
  - open: bool
  - test: "PHQ" | "GAD"
  - score: number
  - onClose: function
  - severity (optional) — if you already computed severity you can pass it, otherwise computeSeverityFromScore will be used
*/

function computeSeverityFromScore(test, score) {
  // PHQ-9 thresholds: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe
  // GAD-7 thresholds: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe
  const s = Number(score) || 0;
  if (test === "PHQ") {
    if (s >= 20) return { label: "Severe", className: "sc-sev-danger" };
    if (s >= 15) return { label: "Moderately severe", className: "sc-sev-warn" };
    if (s >= 10) return { label: "Moderate", className: "sc-sev-amber" };
    if (s >= 5)  return { label: "Mild", className: "sc-sev-mild" };
    return         { label: "Minimal", className: "sc-sev-min" };
  } else {
    // GAD
    if (s >= 15) return { label: "Severe", className: "sc-sev-danger" };
    if (s >= 10) return { label: "Moderate", className: "sc-sev-amber" };
    if (s >= 5)  return { label: "Mild", className: "sc-sev-mild" };
    return         { label: "Minimal", className: "sc-sev-min" };
  }
}

export default function ScoreCard({ open, test = "PHQ", score = 0, severity, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), 8000); // auto close 8s
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  const derived = computeSeverityFromScore(test, score);
  const sevLabel = severity || derived.label;
  const sevClass = derived.className;

  // friendly suggestion by severity
  let suggestion = "Keep practicing self-care and check-ins.";
  if (/severe/i.test(sevLabel)) suggestion = "High severity — please consider contacting a professional immediately.";
  else if (/moderately severe|moderate/i.test(sevLabel)) suggestion = "Moderate — consider reaching out to a clinician or trusted support.";
  else if (/mild/i.test(sevLabel)) suggestion = "Mild — small self-care steps can help. Check resources.";
  else suggestion = "Minimal — good to monitor; check-in occasionally.";

  return (
    <div className="scorecard-modal-backdrop" role="dialog" aria-modal="true">
      <div className={`scorecard-modal animate-scale`}>
        <div className={`scorecard-left ${sevClass}`}>
          <div className="score-large">{score}</div>
          <div className="score-test">{test}</div>
        </div>

        <div className="scorecard-right">
          <div className="score-title">Your {test} result</div>
          <div className="score-severity">{sevLabel}</div>
          <div className="score-suggestion">{suggestion}</div>

          <div className="score-actions">
            <button className="score-btn ghost" onClick={() => onClose && onClose()}>Close</button>
            <a className="score-btn primary" href="#resources" onClick={(e)=>{ /* could open resources */ }}>
              Find resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
