// PHQModal.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";

/**
 * Props:
 *  - onClose(): close modal
 *  - onSubmit(answersArray)
 *  - initialAnswers (optional)
 *  - language (optional)
 */
export default function PHQModal({ onClose, onSubmit, initialAnswers = null, language = "en" }) {
  // PHQ-9 items (friendly wording). You can localize via language prop later.
  const items = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things, such as reading or watching TV",
    "Moving or speaking slowly, or feeling restless",
    "Thoughts you would be better off dead or of hurting yourself"
  ];

  // store answers 0..3; default 0 = "Not at all"
  const [answers, setAnswers] = useState(initialAnswers ?? Array(items.length).fill(0));
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  // small animation when question changes
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.classList.remove("card-enter");
    // force reflow
    void containerRef.current.offsetWidth;
    containerRef.current.classList.add("card-enter");
  }, [index]);

  const choose = (i, value) => {
    const copy = [...answers];
    copy[i] = Number(value);
    setAnswers(copy);
    // small autoprogess if not last
    if (i === index && index < items.length - 1) {
      setTimeout(() => setIndex(index + 1), 260);
    }
  };

  const goNext = () => {
    if (index < items.length - 1) setIndex(index + 1);
  };
  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const submit = () => {
    if (onSubmit) onSubmit(answers);
  };

  // compute percent
  const answeredCount = answers.filter(v => v !== null && v !== undefined).length;
  const progress = Math.round(((index + 1) / items.length) * 100);

  return (
    <div className="assess-overlay">
      <div className="assess-modal">
        <header className="assess-header">
          <div>
            <h2>PHQ-9 — short check</h2>
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
                <path className="ring-bg" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path
                  className="ring-fg"
                  style={{ strokeDasharray: `${progress}, 100` }}
                  d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <text x="18" y="20.5" textAnchor="middle" className="ring-text">{progress}%</text>
              </svg>
              <div className="progress-label">Question {index + 1} of {items.length}</div>
            </div>

            <div className="linear-progress">
              <div className="bar-bg"><div className="bar-fill" style={{ width: `${progress}%` }} /></div>
            </div>

            <div className="nav-hints">
              <button className="tiny" onClick={goPrev} disabled={index === 0}>Back</button>
              <button className="tiny" onClick={goNext} disabled={index === items.length - 1}>Next</button>
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
                  <button className="primary" onClick={submit}>Submit PHQ</button>
                ) : (
                  <button className="primary" onClick={goNext}>Next</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="assess-footer">
          <div className="helper-note">Tip: Answer honestly — there are no wrong answers. If anything is severe, consider professional help.</div>
        </footer>
      </div>
    </div>
  );
}

/* Choice subcomponent */
function Choice({ label, value, onClick, selected, color = "teal" }) {
  return (
    <button onClick={onClick} className={`choice-card ${selected ? "selected" : ""} ${color}`}>
      <div className="choice-label">{label}</div>
      <div className="choice-bubble">{selected ? "✓" : ""}</div>
    </button>
  );
}
