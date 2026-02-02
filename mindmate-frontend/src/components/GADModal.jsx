// GADModal.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

export default function GADModal({ onClose, onSubmit, initialAnswers = null }) {
  const items = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ];

  const [answers, setAnswers] = useState(initialAnswers ?? Array(items.length).fill(0));
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.remove("card-enter");
      void containerRef.current.offsetWidth;
      containerRef.current.classList.add("card-enter");
    }
  }, [index]);

  const choose = (i, v) => {
    const a = [...answers]; a[i] = Number(v); setAnswers(a);
    if (i === index && index < items.length - 1) setTimeout(() => setIndex(index + 1), 220);
  };

  const submit = () => {
    if (onSubmit) onSubmit(answers);
  };

  const progress = Math.round(((index + 1) / items.length) * 100);

  return (
    <div className="assess-overlay">
      <div className="assess-modal">
        <header className="assess-header">
          <div>
            <h2>GAD-7 — short check</h2>
            <p className="sub">How often over the last 2 weeks did you experience these?</p>
          </div>
          <div className="assess-close-row">
            <button className="ghost" onClick={onClose}>Close</button>
          </div>
        </header>

        <div className="assess-body">
          <div className="assess-left">
            <div className="progress-ring-wrap">
              <svg viewBox="0 0 36 36" className="progress-ring">
                <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path className="ring-fg" style={{ strokeDasharray: `${progress}, 100` }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <text x="18" y="20.5" textAnchor="middle" className="ring-text">{progress}%</text>
              </svg>
              <div className="progress-label">Question {index + 1} of {items.length}</div>
            </div>

            <div className="linear-progress">
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${progress}%` }} /></div>
            </div>

          </div>

          <div className="assess-right">
            <div className="q-card" ref={containerRef}>
              <div className="q-index">Q{index + 1}</div>
              <div className="q-text">{items[index]}</div>

              <div className="choices-grid">
                <Choice label="Not at all" value={0} onClick={() => choose(index, 0)} selected={answers[index] === 0} color="teal" />
                <Choice label="Several days" value={1} onClick={() => choose(index, 1)} selected={answers[index] === 1} color="amber" />
                <Choice label="More than half the days" value={2} onClick={() => choose(index, 2)} selected={answers[index] === 2} color="orange" />
                <Choice label="Nearly every day" value={3} onClick={() => choose(index, 3)} selected={answers[index] === 3} color="red" />
              </div>

              <div className="card-actions">
                <button className="ghost" onClick={() => { setAnswers(Array(items.length).fill(0)); setIndex(0); }}>Reset</button>
                {index === items.length - 1 ? (
                  <button className="primary" onClick={submit}>Submit GAD</button>
                ) : (
                  <button className="primary" onClick={() => setIndex(index + 1)}>Next</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="assess-footer">
          <div className="helper-note">If you see items about self-harm and you're in danger, please contact local emergency services.</div>
        </footer>
      </div>
    </div>
  );
}

function Choice({ label, value, onClick, selected, color }) {
  return (
    <button onClick={onClick} className={`choice-card ${selected ? "selected" : ""} ${color}`}>
      <div className="choice-label">{label}</div>
      <div className="choice-bubble">{selected ? "✓" : ""}</div>
    </button>
  );
}
