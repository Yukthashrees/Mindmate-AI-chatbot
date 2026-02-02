// Chat.jsx
import React, { useState, useEffect, useRef } from "react";

/* ---------- GLOBAL STYLES ---------- */

const GLOBAL_STYLES = `
  :root {
    --bg-gradient: radial-gradient(circle at top, #ffe5ec 0, #e0f4ff 35%, #f5f0ff 70%, #fff 100%);
    --primary: #7b5cff;
    --primary-soft: rgba(123, 92, 255, 0.14);
    --accent: #ff8fb7;
    --accent-soft: rgba(255, 143, 183, 0.18);
    --text-main: #1f2335;
    --text-soft: #5b6175;
    --border-soft: rgba(31, 35, 53, 0.07);
    --danger: #ff4b6a;
    --warning: #ffb020;
    --okay: #34c759;
    --info: #2f80ed;
    --card-radius: 22px;
    --shadow-soft: 0 18px 45px rgba(31, 35, 53, 0.14);
    --transition-fast: 0.2s ease;
    --transition-med: 0.35s ease;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
    background: var(--bg-gradient);
  }

  .mindmate-root {
    min-height: 100vh;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 24px 12px;
    background: var(--bg-gradient);
  }

  .mindmate-shell {
    width: 100%;
    max-width: 960px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(18px);
    border-radius: 28px;
    box-shadow: var(--shadow-soft);
    padding: 18px;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: 12px;
    position: relative;
    overflow: hidden;
  }

  .mindmate-shell > * {
    position: relative;
    z-index: 1;
  }

  .mm-floating-orb {
    position: absolute;
    inset: -80px;
    background:
      radial-gradient(circle at 0 0, rgba(255, 143, 183, 0.18), transparent 55%),
      radial-gradient(circle at 100% 0, rgba(123, 92, 255, 0.16), transparent 55%),
      radial-gradient(circle at 0 100%, rgba(47, 128, 237, 0.14), transparent 55%);
    opacity: 0.9;
    pointer-events: none;
    z-index: 0;
    animation: mm-orb-float 18s ease-in-out infinite alternate;
  }

  .mm-glass-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.8));
    pointer-events: none;
    z-index: 0;
  }

  /* HEADER */

  .mm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px 4px;
  }

  .mm-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mm-logo-badge {
    width: 38px;
    height: 38px;
    border-radius: 16px;
    background: conic-gradient(from 160deg, #ff9fbf, #7b5cff, #2f80ed, #ffb020, #ff9fbf);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(123, 92, 255, 0.45);
    position: relative;
    overflow: hidden;
    animation: mm-logo-pulse 2.6s ease-in-out infinite;
  }

  .mm-logo-inner {
    width: 85%;
    height: 85%;
    border-radius: 14px;
    background: radial-gradient(circle at 30% 10%, #fff9fb, #f7f3ff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: var(--primary);
    font-size: 17px;
  }

  .mm-title-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mm-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mm-chip {
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 11px;
    background: rgba(238, 245, 255, 0.9);
    color: var(--primary);
    border: 1px solid rgba(123, 92, 255, 0.14);
  }

  .mm-subtitle {
    font-size: 13px;
    color: var(--text-soft);
  }

  .mm-header-right {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .mm-pill {
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid rgba(31, 35, 53, 0.08);
    font-size: 12px;
    color: var(--text-soft);
    background: rgba(252, 252, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mm-pill select {
    border: none;
    background: transparent;
    font-size: 12px;
    outline: none;
    color: var(--text-main);
  }

  /* BUTTONS */

  .mm-button {
    position: relative;
    padding: 6px 13px;
    border-radius: 999px;
    border: 1px solid var(--border-soft);
    background: rgba(248, 248, 255, 0.9);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--text-main);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 7px rgba(31, 35, 53, 0.12);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast), filter var(--transition-fast);
  }

  .mm-button span.mm-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--okay);
  }

  .mm-button.primary {
    background: linear-gradient(135deg, #7b5cff, #a474ff);
    color: #fff;
    border-color: rgba(123, 92, 255, 0.7);
    box-shadow: 0 7px 20px rgba(123, 92, 255, 0.45);
  }

  .mm-button.secondary {
    background: linear-gradient(135deg, #ff9fbf, #ffd2a0);
    color: #432246;
    border-color: rgba(255, 143, 183, 0.7);
    box-shadow: 0 7px 18px rgba(255, 143, 183, 0.45);
  }

  .mm-button.icon {
    padding-inline: 10px;
  }

  .mm-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(31, 35, 53, 0.22);
    filter: brightness(1.02);
  }

  .mm-button:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(31, 35, 53, 0.2);
  }

  .mm-button.toggled {
    box-shadow: 0 0 0 2px var(--primary-soft);
    background: rgba(123, 92, 255, 0.09);
    border-color: rgba(123, 92, 255, 0.8);
  }

  .mm-button.icon.toggled {
    animation: mm-mic-pulse 1.5s ease-in-out infinite;
  }

  .mm-controls-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 4px 6px 2px;
    justify-content: space-between;
    align-items: center;
  }

  .mm-controls-left,
  .mm-controls-right {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  /* CHAT AREA */

  .mm-chat-area {
    margin-top: 4px;
    border-radius: var(--card-radius);
    background: radial-gradient(circle at top left, rgba(123,92,255,0.10), transparent 55%),
                radial-gradient(circle at bottom right, rgba(255,163,177,0.16), transparent 55%),
                #fbfbff;
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: inset 0 0 0 1px rgba(123,92,255,0.04);
    padding: 14px 14px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 260px;
    max-height: 480px;
  }

  .mm-welcome {
    font-size: 14px;
    color: var(--text-soft);
    margin-bottom: 4px;
  }

  .mm-messages {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mm-bubble-row {
    display: flex;
    width: 100%;
  }

  .mm-bubble-row.me {
    justify-content: flex-end;
  }

  .mm-bubble {
    max-width: 76%;
    padding: 9px 12px 8px;
    border-radius: 16px;
    font-size: 13px;
    line-height: 1.4;
    position: relative;
    animation: mm-pop-in 0.25s ease-out;
    white-space: pre-wrap;
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .mm-bubble.bot {
    background: rgba(255, 255, 255, 0.97);
    border-radius: 18px 18px 18px 6px;
    border: 1px solid rgba(123, 92, 255, 0.16);
    box-shadow: 0 10px 25px rgba(31, 35, 53, 0.12);
    color: var(--text-main);
  }

  .mm-bubble.me {
    background: linear-gradient(135deg, #7b5cff, #a474ff);
    color: #fff;
    border-radius: 18px 18px 6px 18px;
    box-shadow: 0 10px 24px rgba(123, 92, 255, 0.45);
  }

  .mm-bubble-row.me:hover .mm-bubble.me {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(123, 92, 255, 0.6);
  }

  .mm-meta {
    font-size: 10px;
    margin-top: 2px;
    color: rgba(255,255,255,0.85);
    text-align: right;
    opacity: 0.9;
  }

  .mm-meta.bot {
    color: rgba(31, 35, 53, 0.55);
    text-align: left;
  }

  .mm-typing {
    font-size: 12px;
    color: var(--text-soft);
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .mm-typing span {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: rgba(31, 35, 53, 0.4);
    animation: mm-typing 1s infinite ease-in-out;
  }

  .mm-typing span:nth-child(2) { animation-delay: 0.12s; }
  .mm-typing span:nth-child(3) { animation-delay: 0.24s; }

  /* INPUT */

  .mm-input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 4px;
  }

  .mm-input {
    flex: 1;
    font-size: 13px;
    border-radius: 999px;
    border: 1px solid rgba(31, 35, 53, 0.14);
    padding: 9px 12px;
    outline: none;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
  }

  .mm-input::placeholder {
    color: rgba(91, 97, 117, 0.7);
  }

  .mm-input:focus {
    border-color: rgba(123, 92, 255, 0.7);
    box-shadow: 0 0 0 2px rgba(123, 92, 255, 0.18);
    background: #fff;
  }

  .mm-input-send {
    padding-inline: 16px;
    border-radius: 999px;
    border: none;
    outline: none;
    background: linear-gradient(135deg, #7b5cff, #2f80ed);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 9px 20px rgba(47, 128, 237, 0.45);
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  }

  .mm-input-send:hover {
    transform: translateY(-1px);
    box-shadow: 0 11px 24px rgba(47, 128, 237, 0.6);
  }

  .mm-input-send:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(47,128,237,0.6);
  }

  /* SAFETY CARD */

  .mm-safety-card {
    margin-top: 4px;
    border-radius: 20px;
    padding: 10px 12px 8px;
    background: linear-gradient(135deg, rgba(255, 143, 183, 0.12), rgba(123, 92, 255, 0.08));
    border: 1px dashed rgba(123, 92, 255, 0.4);
    box-shadow: 0 14px 32px rgba(31, 35, 53, 0.18);
    font-size: 12px;
    color: var(--text-main);
    display: flex;
    flex-direction: column;
    gap: 6px;
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    pointer-events: none;
    transition: opacity var(--transition-med), transform var(--transition-med);
  }

  .mm-safety-card.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .mm-safety-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 12px;
  }

  .mm-safety-subtitle {
    font-size: 11px;
    color: var(--text-soft);
  }

  .mm-safety-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 6px;
  }

  .mm-safety-input {
    width: 100%;
    border-radius: 999px;
    border: 1px solid rgba(31, 35, 53, 0.18);
    padding: 6px 10px;
    font-size: 11px;
    outline: none;
    background: rgba(255,255,255,0.96);
  }

  .mm-safety-input:focus {
    border-color: rgba(123, 92, 255, 0.7);
    box-shadow: 0 0 0 1px rgba(123, 92, 255, 0.28);
  }

  .mm-safety-actions {
    display: flex;
    justify-content: flex-end;
    gap: 6px;
    margin-top: 4px;
  }

  .mm-safety-chip {
    border-radius: 999px;
    padding: 4px 8px;
    font-size: 10px;
    border: none;
    cursor: pointer;
  }

  .mm-safety-chip.light {
    background: rgba(255,255,255,0.95);
    border: 1px solid rgba(31,35,53,0.18);
  }

  .mm-safety-chip.primary {
    background: rgba(123, 92, 255, 0.12);
    border: 1px solid rgba(123, 92, 255, 0.7);
    color: var(--primary);
  }

  .mm-safety-saved {
    font-size: 10px;
    color: var(--text-soft);
    margin-top: 2px;
  }

  /* MODAL / QUESTIONNAIRE */

  .mm-modal-backdrop {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at top, rgba(0,0,0,0.4), rgba(0,0,0,0.7));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 40;
  }

  .mm-modal {
    width: min(420px, 92vw);
    max-height: min(520px, 85vh);
    background: radial-gradient(circle at top left, rgba(123, 92, 255, 0.15), transparent 60%),
                radial-gradient(circle at bottom right, rgba(255, 143, 183, 0.18), transparent 60%),
                #ffffff;
    border-radius: 26px;
    padding: 18px 18px 14px;
    box-shadow: 0 26px 65px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid rgba(255,255,255,0.92);
    animation: mm-modal-in 0.28s ease-out;
  }

  .mm-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  .mm-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-main);
  }

  .mm-modal-tagline {
    font-size: 12px;
    color: var(--text-soft);
  }

  .mm-modal-close {
    border-radius: 999px;
    border: none;
    width: 26px;
    height: 26px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 3px 9px rgba(31,35,53,0.25);
  }

  .mm-modal-body {
    flex: 1;
    overflow-y: auto;
    padding-right: 2px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mm-progress {
    width: 100%;
    height: 7px;
    border-radius: 999px;
    background: rgba(31, 35, 53, 0.08);
    overflow: hidden;
  }

  .mm-progress-bar {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #7b5cff, #ff9fbf);
    transition: width var(--transition-med);
  }

  .mm-question-count {
    font-size: 11px;
    color: var(--text-soft);
    display: flex;
    justify-content: space-between;
  }

  .mm-question-text {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-main);
    margin-top: 4px;
  }

  .mm-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 6px;
  }

  .mm-option-btn {
    border-radius: 999px;
    border: 1px solid rgba(31, 35, 53, 0.12);
    padding: 7px 10px;
    font-size: 13px;
    background: rgba(255,255,255,0.96);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
  }

  .mm-option-btn span.mm-label {
    flex: 1;
    text-align: left;
  }

  .mm-option-btn span.mm-score-tag {
    font-size: 11px;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(123,92,255,0.08);
    color: var(--primary);
  }

  .mm-option-btn.selected {
    background: rgba(123,92,255,0.1);
    border-color: rgba(123,92,255,0.75);
    box-shadow: 0 7px 20px rgba(123,92,255,0.35);
    transform: translateY(-1px);
  }

  .mm-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  .mm-text-soft {
    font-size: 11px;
    color: var(--text-soft);
  }

  .mm-modal-actions {
    display: flex;
    gap: 8px;
  }

  .mm-nav-btn {
    border-radius: 999px;
    border: none;
    padding: 7px 13px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .mm-nav-btn.back {
    background: rgba(255,255,255,0.98);
    border: 1px solid rgba(31,35,53,0.15);
  }

  .mm-nav-btn.primary {
    background: linear-gradient(135deg, #7b5cff, #a474ff);
    color: #fff;
    box-shadow: 0 10px 24px rgba(123,92,255,0.5);
  }

  .mm-nav-btn:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }

  /* WELLNESS MODAL (GROUNDING / BREATHING) */

  .mm-wellness-block {
    font-size: 13px;
    line-height: 1.5;
    color: var(--text-main);
  }

  .mm-wellness-list {
    margin-top: 6px;
    padding-left: 18px;
    font-size: 12px;
  }

  .mm-breathe-circle {
    width: 90px;
    height: 90px;
    border-radius: 999px;
    margin: 8px auto 4px;
    border: 2px solid rgba(123,92,255,0.45);
    box-shadow: 0 0 24px rgba(123,92,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--text-main);
    animation: mm-breathe 6.5s ease-in-out infinite;
  }

  .mm-wellness-note {
    margin-top: 6px;
    font-size: 11px;
    color: var(--text-soft);
  }

  .mm-wellness-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
    gap: 8px;
  }

  /* SCORE CARD */

  .mm-score-card {
    border-radius: 24px;
    padding: 14px 14px 12px;
    margin-top: 6px;
    color: #fff;
    box-shadow: 0 20px 45px rgba(0,0,0,0.35);
    position: relative;
    overflow: hidden;
  }

  .mm-score-card::before {
    content: "";
    position: absolute;
    inset: -40%;
    opacity: 0.18;
    background:
      radial-gradient(circle at 0 0, #fff, transparent 55%),
      radial-gradient(circle at 100% 100%, #fff, transparent 55%);
  }

  .mm-score-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .mm-score-label {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.9;
  }

  .mm-score-value {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .mm-score-pill {
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(12px);
  }

  .mm-score-body {
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.94;
  }

  .mm-score-range {
    margin-top: 4px;
    font-size: 10px;
    opacity: 0.86;
  }

  .mm-score-note {
    margin-top: 6px;
    font-size: 10px;
    opacity: 0.9;
  }

  .mm-score-card.minimal { background: linear-gradient(135deg, #34c759, #00a86b); }
  .mm-score-card.mild    { background: linear-gradient(135deg, #ffb020, #ff9f40); }
  .mm-score-card.moderate{ background: linear-gradient(135deg, #ff8a5c, #ff4b6a); }
  .mm-score-card.severe  { background: linear-gradient(135deg, #ff4b6a, #b31217); }

  .mm-score-recs {
    margin-top: 8px;
    font-size: 11px;
    opacity: 0.94;
  }

  .mm-score-recs-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .mm-score-recs-list {
    margin: 0;
    padding-left: 16px;
  }

  .mm-score-recs-list li {
    margin-bottom: 2px;
  }

  /* KEYFRAMES */

  @keyframes mm-pop-in {
    from { transform: translateY(3px) scale(0.98); opacity: 0; }
    to   { transform: translateY(0) scale(1); opacity: 1; }
  }

  @keyframes mm-typing {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-2px); opacity: 1; }
  }

  @keyframes mm-modal-in {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes mm-orb-float {
    0% { transform: translate3d(0,0,0) scale(1); }
    50% { transform: translate3d(10px, -12px, 0) scale(1.02); }
    100% { transform: translate3d(-6px, 8px, 0) scale(1.01); }
  }

  @keyframes mm-logo-pulse {
    0%, 100% { transform: scale(1); box-shadow: 0 10px 25px rgba(123, 92, 255, 0.45); }
    50% { transform: scale(1.06); box-shadow: 0 16px 32px rgba(123, 92, 255, 0.65); }
  }

  @keyframes mm-mic-pulse {
    0% { box-shadow: 0 0 0 0 rgba(47,128,237,0.4); }
    70% { box-shadow: 0 0 0 8px rgba(47,128,237,0); }
    100% { box-shadow: 0 0 0 0 rgba(47,128,237,0); }
  }

  @keyframes mm-breathe {
    0%   { transform: scale(0.9); opacity: 0.8; }
    40%  { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.85; }
  }

  @media (max-width: 640px) {
    .mindmate-shell {
      padding: 14px 12px;
      border-radius: 22px;
    }
    .mm-title {
      font-size: 19px;
    }
    .mm-chat-area {
      min-height: 220px;
    }
  }
`;

/* ---------- QUESTIONS & HELPERS ---------- */

const PHQ_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching TV",
  "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const GAD_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const OPTION_LABELS = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

function calculatePhqSeverity(score) {
  if (score <= 4) return { level: "Minimal", key: "minimal" };
  if (score <= 9) return { level: "Mild", key: "mild" };
  if (score <= 14) return { level: "Moderate", key: "moderate" };
  if (score <= 19) return { level: "Moderately severe", key: "moderate" };
  return { level: "Severe", key: "severe" };
}

function calculateGadSeverity(score) {
  if (score <= 4) return { level: "Minimal", key: "minimal" };
  if (score <= 9) return { level: "Mild", key: "mild" };
  if (score <= 14) return { level: "Moderate", key: "moderate" };
  return { level: "Severe", key: "severe" };
}

/* -------- Language strings -------- */

const UI_TEXT = {
  en: {
    subtitle: "“One tiny step at a time is still progress.” 🌈",
    welcome:
      "Welcome to your cosy corner. Type or speak anything you’re feeling — MindMate will respond gently. ✨",
    phqButton: "💗 Quick PHQ-9",
    gadButton: "🌊 Quick GAD-7",
    groundingButton: "🌿 5–4–3–2–1 Grounding",
    breathingButton: "💨 Calm breathing",
    testTagline:
      "Answer based on how you’ve felt over the last 2 weeks. There are no right or wrong answers. 💬",
    safetyTitle: "In case you ever feel really unsafe",
    safetySubtitle:
      "You can save one trusted person here. I’ll gently remind you about them if things feel too heavy. This is optional and stays on this device.",
    safetyYourName: "Your name",
    safetyPersonLabel: "Their name",
    safetyRelationLabel: "Relationship to you",
    safetyContactLabel: "Phone / WhatsApp / Insta ID",
    safetySkip: "Not now",
    safetySave: "Save safety contact",
    safetySavedNote:
      "Got it. If your scores are high or you say you feel unsafe, I’ll remind you that this person is there for you. 💛",
    firstReply: (name) =>
      `Hi ${name || "there"}, I'm really glad you reached out today. 💛\nHow are you feeling right now? You don’t have to be “okay” for me to listen.\n\nIf at any point you’d like, you can try a gentle PHQ-9 or GAD-7 check using the buttons above — totally your choice.`,
    normalReplySoft:
      "Thank you for sharing that with me. It sounds like a lot to carry. 🌿 I’m here with you.\n\nIf things feel heavy, you can also try a quick PHQ or GAD check, or one of the grounding / breathing tools above.",
    normalReplyDeeper:
      "I hear you, and I’m really sorry it’s been this hard. You deserve kindness and support, including from yourself. 💛\n\nYou can use the PHQ / GAD check, or tap the grounding or breathing tools above if you need a quick calm-down moment.",
    groundingTitle: "5–4–3–2–1 Grounding",
    groundingBody:
      "Let’s gently bring you back to the present. Slowly notice:\n\n• 5 things you can SEE\n• 4 things you can TOUCH\n• 3 things you can HEAR\n• 2 things you can SMELL\n• 1 thing you can TASTE (or imagine the taste)\n\nYou can say them out loud or just in your head.",
    groundingHint:
      "Move through the senses at your own pace. There’s no rush — you’re allowed to take it slow.",
    breathingTitle: "4–7–8 Calm Breathing",
    breathingBody:
      "We’ll do a few soft rounds:\n\n1. Inhale gently through your nose for 4 seconds.\n2. Hold your breath for 7 seconds.\n3. Exhale slowly through your mouth for 8 seconds.\n\nYou can follow the circle and tap “Next breath” whenever you’re ready.",
    breathingSafetyNote:
      "If you feel dizzy or uncomfortable, pause and return to your natural breathing. If you ever feel in immediate danger, please reach out to emergency services or a trusted adult right away.",
    breathingNext: "Next breath",
    breathingDone: "All done",
    wellnessClose: "Close",
  },
  hi: {
    subtitle: "“छोटा सा भी कदम, आगे ही बढ़ता है।” 🌈",
    welcome:
      "यह आपकी अपनी safe जगह है। जो भी महसूस हो रहा है, टाइप करें या बोलें — MindMate धीरे-धीरे जवाब देगा। ✨",
    phqButton: "💗 PHQ-9 जल्दी चेक",
    gadButton: "🌊 GAD-7 जल्दी चेक",
    groundingButton: "🌿 5–4–3–2–1 ग्राउंडिंग",
    breathingButton: "💨 सुकून वाली साँसें",
    testTagline:
      "पिछले 2 हफ्तों में आप जैसा महसूस कर रहे थे, उसके हिसाब से जवाब दें। सही या गलत जैसा कुछ नहीं है। 💬",
    safetyTitle: "अगर कभी बहुत असुरक्षित महसूस हो",
    safetySubtitle:
      "आप यहाँ किसी एक भरोसेमंद व्यक्ति का नाम लिख सकते हैं। जब सब कुछ बहुत भारी लगे, मैं बस आपको याद दिलाऊँगा कि वो आपके साथ हैं। यह पूरी तरह आपकी मर्ज़ी पर है और यही डिवाइस पर रहता है।",
    safetyYourName: "आपका नाम",
    safetyPersonLabel: "उनका नाम",
    safetyRelationLabel: "आपसे रिश्ता",
    safetyContactLabel: "फ़ोन / WhatsApp / Insta ID",
    safetySkip: "अभी नहीं",
    safetySave: "सेफ़्टी कॉन्टैक्ट सेव करें",
    safetySavedNote:
      "ठीक है। अगर आपकी स्कोर ज़्यादा आए या आप कहें कि आप unsafe महसूस कर रहे हैं, तो मैं आपको बस धीरे से याद दिलाऊँगा कि यह व्यक्ति आपके लिए है। 💛",
    firstReply: (name) =>
      `हाय ${name || "दोस्त"}, यह बहुत हिम्मत की बात है कि आपने यहाँ लिखना शुरू किया। 💛\nअभी आप कैसा महसूस कर रहे हैं? आपको “ठीक” होने की ज़रूरत नहीं है, बस सच बताना काफी है।\n\nअगर कभी मन करे तो ऊपर दिए गए PHQ-9 या GAD-7 से एक छोटा चेक भी कर सकते हैं — पूरी तरह आपकी choice है।`,
    normalReplySoft:
      "आपने जो भी शेयर किया, वो हल्का नहीं है। 🌿 मैं आपकी बात सुनने के लिए यहीं हूँ।\n\nअगर बहुत भारी लगे, तो आप ऊपर दिए गए PHQ / GAD चेक या ग्राउंडिंग / breathing टूल का इस्तेमाल कर सकते हैं।",
    normalReplyDeeper:
      "मैं महसूस कर पा रहा हूँ कि यह सब आपके लिए कितना मुश्किल रहा है। आप सच में support और softness के लायक हैं। 💛\n\nऊपर दिए गए PHQ / GAD चेक या ग्राउंडिंग / breathing से आप थोड़ा सा सुकून ले सकते हैं, अगर मन हो तो।",
    groundingTitle: "5–4–3–2–1 ग्राउंडिंग",
    groundingBody:
      "चलो धीरे-धीरे खुद को अभी के पल में लाते हैं:\n\n• 5 चीज़ें जो आप देख सकते हैं\n• 4 चीज़ें जिन्हें आप छू सकते हैं\n• 3 आवाज़ें जो आप सुन सकते हैं\n• 2 खुशबूएँ जो आप सूँघ सकते हैं\n• 1 स्वाद जो आप महसूस कर सकते हैं (या imagine कर सकते हैं)\n\nआप इन्हें ज़ोर से बोल सकते हैं या बस मन ही मन सोच सकते हैं।",
    groundingHint:
      "आप अपनी speed से जाएँ। जल्दी करने की कोई ज़रूरत नहीं है।",
    breathingTitle: "4–7–8 सुकून वाली सांस",
    breathingBody:
      "हम कुछ हल्की साँसों के राउंड करेंगे:\n\n1. नाक से 4 सेकंड तक धीरे-धीरे साँस अंदर लें।\n2. 7 सेकंड तक रोकें।\n3. मुँह से 8 सेकंड तक धीरे-धीरे साँस बाहर छोड़ें।\n\nआप गोल circle को देख सकते हैं और जब भी तैयार हों, “Next breath” दबा सकते हैं।",
    breathingSafetyNote:
      "अगर चक्कर जैसा लगे या असहज महसूस हो, तो तुरंत रुक जाएँ और सामान्य साँस लें। अगर कभी आपको लगे कि आप ख़तरे में हैं, तो तुरंत emergency services या किसी भरोसेमंद बड़े से मदद लें।",
    breathingNext: "Next breath",
    breathingDone: "खत्म",
    wellnessClose: "बंद करें",
  },
  ka: {
    subtitle: "“ಒಂದು ಚಿಕ್ಕ ಹೆಜ್ಜೆಯೂ ಮುಂದೆ ಸಾಗುವದೇ ಪ್ರಗತಿ.” 🌈",
    welcome:
      "ಇದು ನಿನ್ನ own safe ಜಾಗ. ನಿನಗೆ ಹೇಗೇ ಅನಿಸುತ್ತಿರಲಿ, ಟೈಪ್ ಮಾಡೋದು ಅಥವಾ ಮಾತಾಡೋದು ಸಾಕು — MindMate ನಿನ್ನ ಜೊತೆ ಹಾಯಾಗಿ ಇರುತ್ತದೆ. ✨",
    phqButton: "💗 PHQ-9 ಚಿಕ್ಕ ಚೆಕ್",
    gadButton: "🌊 GAD-7 ಚಿಕ್ಕ ಚೆಕ್",
    groundingButton: "🌿 5–4–3–2–1 grounding",
    breathingButton: "💨 calm breathing",
    testTagline:
      "ಕಳೆದ 2 ವಾರಗಳಲ್ಲಿ ನಿನಗೆ ಹೇಗನಿಸಿತೋ ಅದನ್ನೇ ನೆನೆದು ಉತ್ತರ ಕೊಡು. ಇಲ್ಲಿ right / wrong ಅನ್ನೋದೇ ಇಲ್ಲ. 💬",
    safetyTitle: "ಒಂದೇ ಸಲ ತುಂಬಾ unsafe ಅನ್ನಿಸಿದ್ರೆ",
    safetySubtitle:
      "ಇಲ್ಲಿ ನೀನು ಒಬ್ಬ ಭರವಸೆಯ ವ್ಯಕ್ತಿಯ ವಿವರವನ್ನು ಸೇವ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು. ನಿನಗೆ ತುಂಬಾ ಕಷ್ಟವಾಗಿ feel ಆದ್ರೆ, ಅವರ ಬಗ್ಗೆ ನಿನಗೆ ಜಸ್ಟ್ remind ಮಾಡ್ತೀನಿ. ಇದು ಪೂರ್ಣವಾಗಿ ನಿನ್ನ choice ಮತ್ತು ಈ device ಒಳಗೆ ಮಾತ್ರ ಇರುತ್ತದೆ.",
    safetyYourName: "ನಿನ್ನ ಹೆಸರು",
    safetyPersonLabel: "ಅವರ ಹೆಸರು",
    safetyRelationLabel: "ನಿನಗೆ ಅವರ ಸಂಬಂಧ",
    safetyContactLabel: "Phone / WhatsApp / Insta ID",
    safetySkip: "ಇಗಾಗಲೇ ಬೇಡ",
    safetySave: "Safety contact save ಮಾಡು",
    safetySavedNote:
      "ಸರಿ, ಗೋತ್ತಾಯ್ತು. ನಿನ್ನ score ಜಾಸ್ತಿ ಬಂದರೂ, ಅಥವಾ unsafe ಅಂತ ನೀನೇ ಹೇಳಿದ್ರೆ, ಈ ವ್ಯಕ್ತಿ ನಿನ್ನ ಜೊತೆಯಲ್ಲಿದ್ದಾರೆ ಅಂತ ನಿನಗೆ ನಿಧಾನವಾಗಿ ನೆನಪಿಸುತ್ತೀನಿ. 💛",
    firstReply: (name) =>
      `ಹೇ ${name || "ನಿನ್ನಾ"}, ಇಲ್ಲಿ ಬಂದಿದ್ದಕ್ಕೆ ಧೈರ್ಯ ಬೇಕು. 💛\nಈಗ ನಿನಗೆ ಹೇಗನಿಸುತ್ತದೆ? “ಓಕೆ” ಇರಬೇಕೆಂಬ ಒತ್ತಡ ಇಲ್ಲ, ನಿಜವಾದ ಫೀಲೀಂಗ್ ಇದ್ದಷ್ಟೂ ಸಾಕು.\n\nನಿನಗೆ ಬೇಕೆನಿಸಿದ್ರೆ ಮಾತ್ರ, ಮೇಲೆ ಇರುವ PHQ-9 / GAD-7 buttons use ಮಾಡಿ ಒಮ್ಮೆ mind check ಮಾಡ್ಕೊಳ್ಳಬಹುದು.`,
    normalReplySoft:
      "ನೀನು share ಮಾಡಿದದ್ದು ಲೈಟ್ ವಿಷಯವಲ್ಲ. 🌿 ನಿನ್ನ ಮಾತು ಕೇಳೋಕೆ ನಾನು ಇಲ್ಲಿದ್ದೀನಿ.\n\nಹೆಚ್ಚಾಗಿ heavy ಆಗಿದ್ದ್ರೆ, ಮೇಲೆ ಇರುವ PHQ / GAD ಚೆಕ್ ಅಥವಾ grounding / breathing ಟೂಲ್ try ಮಾಡಬಹುದು.",
    normalReplyDeeper:
      "ಇಷ್ಟು ದಿನ ನಿನಗೆ ಎಷ್ಟು ಕಷ್ಟವಾಯಿತೋ ಅದೇ ನಿನ್ನ ಮಾತಿನಲ್ಲಿ ಬರುತ್ತಿದೆ. ನೀನು ಪ್ರೀತಿಗೂ, support ಗೂ ಅರ್ಹ. 💛\n\nಬೇಕೆನಿಸಿದ್ರೆ, ಮೇಲೆ ಇರುವ PHQ / GAD ಚೆಕ್, ಅಥವಾ grounding / breathing use ಮಾಡಿ ಸ್ವಲ್ಪ calm feel ಮಾಡ್ಕೊಳ್ಳಬಹುದು.",
    groundingTitle: "5–4–3–2–1 grounding",
    groundingBody:
      "ಇಗ ಒಂದುದೊಂದು sense ಕಡೆ ಗಮನ ಹರಿಸೋಣ:\n\n• ನೋಡೋ 5 ವಸ್ತುಗಳು\n• ಮುಟ್ಟೋ 4 ವಸ್ತುಗಳು\n• ಕೇಳೋ 3 ಸೌಂಡ್‌ಗಳು\n• ಘಮಘಮಿಸೋ 2 ವಾಸನೆಗಳು\n• taste ಮಾಡೋ (ಅಥವಾ imagine ಮಾಡೋ) 1 ವಸ್ತು\n\nಇವನ್ನು ಜೋರಾಗಿ ಹೇಳ್ಬಹುದು, ಇಲ್ಲ ಅಂದ್ರೆ ಮನಸ್ಸಲ್ಲಿ ನೆನೆಸಿಕೊಂಡ್ರೂ ಸಾಕು.",
    groundingHint:
      "ನಿನ್ನ ವೇಗದಲ್ಲಿ ಹೋಗು. ಬೇಗ ಬೇಡ, slow ಆಗಿರ್ಬೋದು safe.",
    breathingTitle: "4–7–8 calm breathing",
    breathingBody:
      "ಸಲಪ ಸುತ್ತುಗಳು ಮಾಡೋಣ:\n\n1. ಮೂಗಿನಿಂದ 4 ಸೆಕೆಂಡ್ ಜೋರಾಗಿರದಂತೆ ಉಸಿರೆಳೆ.\n2. 7 ಸೆಕೆಂಡ್ ಹಿಡ್ಕೋ.\n3. ಬಾಯಿಂದ 8 ಸೆಕೆಂಡ್ ನಿಧಾನವಾಗಿ ಉಸಿರಬಿಡು.\n\nಮಧ್ಯದಲ್ಲಿರುವ circle ನೋಡಿ, ಸಿದ್ಧ ಅನ್ನಿಸಿದ್ಮೇಲೆ “Next breath” ಒತ್ತೋದು ಸಾಕು.",
    breathingSafetyNote:
      "ಚಕ್ಕರ್ ಬಂದಂತೆ ಅನ್ನಿಸಿದ್ರೆ ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ, ನಿನ್ನ ಸಾಮಾನ್ಯ ಉಸಿರಾಟಕ್ಕೆ ಮರಳಿ. ಒಮ್ಮೆ ಆದರೂ ನಿನಗೆ ನಿಜವಾಗಿಯೂ ಅಪಾಯ ಇಲ್ಲ ಅಂತಾ ಅನಿಸದಿದ್ದರೆ, ತಕ್ಷಣ emergency services ಅಥವಾ ನಂಬಿಕೆಯ ಹಿರಿಯರ ನೆರವು ಕೇಳು.",
    breathingNext: "Next breath",
    breathingDone: "ಮುಗಿತು",
    wellnessClose: "ಮುಚ್ಚು",
  },
};

function getLangTag(language) {
  if (language === "hi") return "hi-IN";
  if (language === "ka") return "kn-IN";
  return "en-IN";
}

/* ---- Helpers for TTS (no emojis, male-ish voice) ---- */

function cleanForSpeech(text) {
  if (!text) return "";
  let cleaned = text.replace(/\n/g, " ");
  try {
    cleaned = cleaned.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, "");
  } catch (e) {
    // ignore if regex fails
  }
  return cleaned;
}

function pickMaleishVoice(langTag) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (!voices || !voices.length) return null;

  const maleHints = [/male/i, /man/i, /boy/i];

  let voice =
    voices.find(
      (v) =>
        v.lang === langTag && maleHints.some((re) => re.test(v.name))
    ) ||
    voices.find((v) => v.lang === langTag) ||
    voices.find((v) => v.lang && v.lang.startsWith(langTag.slice(0, 2)));

  return voice || null;
}

/* peaceful-mind suggestions based on severity */
function getRecommendations(type, severityKey) {
  if (severityKey === "severe") {
    return [
      "Reach out to someone you trust and tell them how you’re feeling — even a short text like “I’m having a hard time” is enough.",
      "If you can, contact a mental health professional or a helpline in your area for more direct support.",
      "Try a few rounds of 4–7–8 breathing: inhale for 4 seconds, hold for 7, exhale slowly for 8.",
      "Keep your environment as safe as possible. If you feel at risk of harming yourself, seek emergency help right away.",
    ];
  }
  if (severityKey === "moderate") {
    return [
      "Do a 5–4–3–2–1 grounding check: notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      "Plan one gentle activity you usually enjoy (a walk, music, a warm shower, talking to a friend) in the next 24 hours.",
      "Write a quick brain-dump in your notes for 5–10 minutes — no judging, just emptying your mind.",
      "If it’s possible, consider talking with a counsellor or therapist about how you’ve been feeling.",
    ];
  }
  if (severityKey === "mild") {
    return [
      "Protect small pockets of calm time in your day: a few minutes of stretching, slow breathing or quiet music.",
      "Notice what slightly improves your mood (sunlight, movement, hobbies) and gently do a tiny bit more of it.",
      "Try to keep a regular sleep schedule as much as you can — your brain heals a lot during rest.",
    ];
  }
  // minimal
  return [
    "Keep doing the tiny habits that already support your mind — they’re working more than you think.",
    "Check in with yourself once in a while, even on good days, and be kind to any emotions that show up.",
  ];
}

function ScoreCard({ type, score, max, severity, message }) {
  const recommendations = getRecommendations(type, severity.key);

  return (
    <div className={`mm-score-card ${severity.key}`}>
      <div className="mm-score-top">
        <div>
          <div className="mm-score-label">
            {type === "PHQ" ? "PHQ-9 Depression Check" : "GAD-7 Anxiety Check"}
          </div>
          <div className="mm-score-value">
            {score} <span style={{ fontSize: 14, fontWeight: 500 }}>/ {max}</span>
          </div>
        </div>
        <div className="mm-score-pill">{severity.level}</div>
      </div>
      <div className="mm-score-body">{message}</div>

      {recommendations && recommendations.length > 0 && (
        <div className="mm-score-recs">
          <div className="mm-score-recs-title">
            Gentle ideas for a more peaceful mind:
          </div>
          <ul className="mm-score-recs-list">
            {recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mm-score-range">
        This card is only a gentle indicator, not a diagnosis. If these feelings
        are hard to handle, please consider talking with a trusted person or a
        mental health professional.
      </div>
      <div className="mm-score-note">
        If you ever have thoughts of harming yourself, please seek immediate
        help from local emergency services or a helpline in your area.
      </div>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function Chat() {
  // inject styles once
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = GLOBAL_STYLES;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // clientId for backend (Mongo)
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let existing = localStorage.getItem("mindmateClientId");
    if (!existing) {
      existing =
        "mm_" +
        Math.random().toString(36).substring(2) +
        Date.now().toString(36);
      localStorage.setItem("mindmateClientId", existing);
    }
    setClientId(existing);
  }, []);

  const [language, setLanguage] = useState("en");
  const [speakOn, setSpeakOn] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const [userName, setUserName] = useState("");
  const [safetyInfo, setSafetyInfo] = useState({
    contactName: "",
    relation: "",
    contactDetail: "",
  });
  const [hasAskedSafety, setHasAskedSafety] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [safetySaved, setSafetySaved] = useState(false);

  const texts = UI_TEXT[language] || UI_TEXT.en;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi — I'm MindMate. I'm here to listen. 😊\nBefore we start, what should I call you?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // PHQ / GAD state
  const [activeTest, setActiveTest] = useState(null); // "PHQ" | "GAD" | null
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phqAnswers, setPhqAnswers] = useState(
    Array(PHQ_QUESTIONS.length).fill(null)
  );
  const [gadAnswers, setGadAnswers] = useState(
    Array(GAD_QUESTIONS.length).fill(null)
  );
  const [latestScore, setLatestScore] = useState(null); // { type, score, max, severity, message }

  // Grounding / breathing tools
  const [activeTool, setActiveTool] = useState(null); // "GROUNDING" | "BREATHING" | null
  const [breathCount, setBreathCount] = useState(1);

  const currentQuestions = activeTest === "PHQ" ? PHQ_QUESTIONS : GAD_QUESTIONS;
  const answers = activeTest === "PHQ" ? phqAnswers : gadAnswers;
  const maxScore = currentQuestions.length * 3;

  // speech recognition + TTS refs
  const recognitionRef = useRef(null);
  const lastSpokenIdRef = useRef(null);

  /* ---- Load safety info from backend when clientId is ready ---- */
  useEffect(() => {
    if (!clientId) return;

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/safety/${clientId}`
        );
        const data = await res.json();
        if (data.ok) {
          if (data.user?.name) setUserName(data.user.name);
          if (data.safety) {
            setSafetyInfo({
              contactName: data.safety.contactName || "",
              relation: data.safety.relation || "",
              contactDetail: data.safety.contactDetail || "",
            });
          }
        }
      } catch (err) {
        console.error("Error loading safety info", err);
      }
    })();
  }, [clientId]);

  /* ---- set up SpeechRecognition ---- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getLangTag(language);
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update recognition language when user switches language
  useEffect(() => {
    const rec = recognitionRef.current;
    if (rec) {
      rec.lang = getLangTag(language);
    }
  }, [language]);

  const toggleMic = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Mic speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        // already started
      }
    }
  };

  /* ---- Text-to-speech for bot messages (male voice, no emojis) ---- */
  useEffect(() => {
    if (!speakOn || typeof window === "undefined" || !window.speechSynthesis)
      return;

    const lastBot = [...messages].reverse().find((m) => m.from === "bot");
    if (!lastBot) return;
    if (lastSpokenIdRef.current === lastBot.id) return;

    const synth = window.speechSynthesis;
    const speechLang = getLangTag(language);
    const text = cleanForSpeech(lastBot.text);

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 0.9; // slightly deeper = more “male”
    utter.volume = 0.9;
    utter.lang = speechLang;

    const voice = pickMaleishVoice(speechLang);
    if (voice) {
      utter.voice = voice;
    }

    synth.cancel();
    synth.speak(utter);
    lastSpokenIdRef.current = lastBot.id;
  }, [messages, speakOn, language]);

  useEffect(() => {
    if (!speakOn && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [speakOn]);

  /* ---- Read out grounding / breathing tools ---- */
  useEffect(() => {
    if (
      !activeTool ||
      !speakOn ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    const synth = window.speechSynthesis;
    const speechLang = getLangTag(language);
    const langTexts = UI_TEXT[language] || UI_TEXT.en;

    const rawText =
      activeTool === "GROUNDING"
        ? langTexts.groundingBody
        : langTexts.breathingBody;

    const utter = new SpeechSynthesisUtterance(cleanForSpeech(rawText));
    utter.lang = speechLang;
    utter.rate = activeTool === "GROUNDING" ? 0.95 : 0.9;
    utter.pitch = 0.9;

    const voice = pickMaleishVoice(speechLang);
    if (voice) {
      utter.voice = voice;
    }

    synth.cancel();
    synth.speak(utter);
  }, [activeTool, speakOn, language]);

  /* ---- Chat behaviour ---- */

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const meMsg = {
      id: Date.now(),
      from: "me",
      text: trimmed,
    };

    // detect first user message to treat as name
    const hasAnyUser = messages.some((m) => m.from === "me");
    let inferredName = userName;
    const isFirstMessage = !hasAnyUser;

    if (isFirstMessage) {
      inferredName = trimmed.split(/\s+/)[0];
      setUserName(inferredName);
      // open safety panel gently after they first say their name
      setHasAskedSafety(true);
      setIsSafetyOpen(true);
    }

    setMessages((prev) => [...prev, meMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: isFirstMessage
            ? texts.firstReply(inferredName)
            : prev.length < 4
            ? texts.normalReplySoft
            : texts.normalReplyDeeper,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  /* ---- PHQ / GAD ---- */

  const openTest = (type) => {
    setActiveTest(type);
    setCurrentIndex(0);
    if (type === "PHQ") {
      setPhqAnswers(Array(PHQ_QUESTIONS.length).fill(null));
    } else {
      setGadAnswers(Array(GAD_QUESTIONS.length).fill(null));
    }
    setLatestScore(null);
  };

  const closeModal = () => {
    setActiveTest(null);
  };

  const handleOptionSelect = (score) => {
    const idx = currentIndex;
    if (activeTest === "PHQ") {
      const copy = [...phqAnswers];
      copy[idx] = score;
      setPhqAnswers(copy);
    } else {
      const copy = [...gadAnswers];
      copy[idx] = score;
      setGadAnswers(copy);
    }
  };

const goNext = () => {
  if (currentIndex < currentQuestions.length - 1) {
    setCurrentIndex((i) => i + 1);
    return;
  }

  // 1) compute total score
  const total =
    activeTest === "PHQ"
      ? phqAnswers.reduce((sum, v) => sum + (v ?? 0), 0)
      : gadAnswers.reduce((sum, v) => sum + (v ?? 0), 0);

  // 2) figure out severity object
  const severity =
    activeTest === "PHQ"
      ? calculatePhqSeverity(total)
      : calculateGadSeverity(total);

  // 3) extra friendly message
  const extraMessage =
    activeTest === "PHQ"
      ? severity.key === "minimal"
        ? "Your PHQ-9 score suggests minimal signs of depression right now. It's still okay to seek support whenever you need it."
        : severity.key === "mild"
        ? "Your PHQ-9 score suggests some early signs of low mood. Reaching out to supportive people or a professional could be helpful."
        : severity.key === "moderate"
        ? "Your PHQ-9 score is in a range where talking to a mental health professional would be a kind step for yourself."
        : "Your PHQ-9 score is quite high. Please consider connecting with a mental health professional or helpline for support."
      : severity.key === "minimal"
      ? "Your GAD-7 score suggests minimal anxiety right now. Still, your feelings are always valid."
      : severity.key === "mild"
      ? "Your GAD-7 score suggests some anxiety. Gentle coping strategies and support might help."
      : severity.key === "moderate"
      ? "Your GAD-7 score suggests notable anxiety. Talking with a professional could really support you."
      : "Your GAD-7 score is high. Please consider reaching out to a trusted person, professional, or helpline.";

  const scoreInfo = {
    type: activeTest,
    score: total,
    max: maxScore,
    severity,
    message: extraMessage,
  };
  setLatestScore(scoreInfo);

  // 4) send to backend so Mongo + alerts get it
  try {
    fetch("http://localhost:5000/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,                      // make sure you have clientId state
        type: activeTest,              // "PHQ" or "GAD"
        score: total,
        max: maxScore,
        severityKey: severity.key,     // this is what backend checks
        answers:
          activeTest === "PHQ" ? phqAnswers : gadAnswers,
      }),
    }).catch((err) => {
      console.error("Error saving assessment:", err);
    });
  } catch (err) {
    console.error("Error saving assessment:", err);
  }

  // 5) show short result message in chat
  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      from: "bot",
      text: `${
        activeTest === "PHQ" ? "PHQ-9" : "GAD-7"
      } score: ${total}/${maxScore} (${severity.level}).\nThis is just a gentle indicator, not a diagnosis.`,
    },
    severity.key === "severe"
      ? {
          id: Date.now() + 2,
          from: "bot",
          text:
            "Your result is in the higher range. You deserve support — if you can, please reach out to a trusted person or a professional, and keep yourself safe. You’re not alone in this. 💛",
        }
      : null,
  ].filter(Boolean));
};


  const goBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const progressPercent = ((currentIndex + 1) / currentQuestions.length) * 100;

  /* ---- Wellness tools ---- */

  const closeToolModal = () => {
    setActiveTool(null);
    setBreathCount(1);
  };

  const handleSaveSafety = async () => {
    setSafetySaved(true);

    try {
      if (!clientId) return;

      await fetch("http://localhost:5000/api/user/safety", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          name: userName,
          contactName: safetyInfo.contactName,
          relation: safetyInfo.relation,
          contactDetail: safetyInfo.contactDetail,
        }),
      });
    } catch (err) {
      console.error("Error saving safety contact", err);
    }

    setTimeout(() => setSafetySaved(false), 4000);
  };

  /* ---------- RENDER ---------- */

  return (
    <div className="mindmate-root">
      <div className="mindmate-shell">
        <div className="mm-floating-orb" />
        <div className="mm-glass-mask" />

        {/* HEADER */}
        <header className="mm-header">
          <div className="mm-brand">
            <div className="mm-logo-badge">
              <div className="mm-logo-inner">MM</div>
            </div>
            <div className="mm-title-block">
              <div className="mm-title">
                MindMate
                <span className="mm-chip">Gentle check-ins · Safe space</span>
              </div>
              <div className="mm-subtitle">{texts.subtitle}</div>
            </div>
          </div>

          <div className="mm-header-right">
            <div className="mm-pill">
              <span role="img" aria-label="globe">
                🌍
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ka">Kannada</option>
              </select>
            </div>

            <button
              className={`mm-button icon ${speakOn ? "toggled" : ""}`}
              type="button"
              onClick={() => setSpeakOn((s) => !s)}
            >
              <span className="mm-dot" />
              Speak: {speakOn ? "On" : "Off"}
            </button>
          </div>
        </header>

        {/* CONTROL ROW */}
        <div className="mm-controls-row">
          <div className="mm-controls-left">
            <button
              type="button"
              className="mm-button primary"
              onClick={() => openTest("PHQ")}
            >
              {texts.phqButton}
            </button>
            <button
              type="button"
              className="mm-button secondary"
              onClick={() => openTest("GAD")}
            >
              {texts.gadButton}
            </button>
          </div>
          <div className="mm-controls-right">
            <button
              type="button"
              className="mm-button icon"
              onClick={() => setActiveTool("GROUNDING")}
            >
              {texts.groundingButton}
            </button>
            <button
              type="button"
              className="mm-button icon"
              onClick={() => setActiveTool("BREATHING")}
            >
              {texts.breathingButton}
            </button>
            <button
              type="button"
              className={`mm-button icon ${isListening ? "toggled" : ""}`}
              onClick={toggleMic}
            >
              🎙 Mic {isListening ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* CHAT AREA */}
        <section className="mm-chat-area">
          <div className="mm-welcome">{texts.welcome}</div>
          <div className="mm-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mm-bubble-row ${m.from === "me" ? "me" : "bot"}`}
              >
                <div className={`mm-bubble ${m.from === "me" ? "me" : "bot"}`}>
                  {m.text}
                  <div className={`mm-meta ${m.from === "me" ? "" : "bot"}`}>
                    {m.from === "me" ? "You" : "MindMate"}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mm-bubble-row bot">
                <div className="mm-bubble bot">
                  <span className="mm-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  <div className="mm-meta bot">MindMate is thinking…</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SAFETY CARD */}
        {hasAskedSafety && (
          <section className={`mm-safety-card ${isSafetyOpen ? "open" : ""}`}>
            <div className="mm-safety-title">
              <span>🕊 {texts.safetyTitle}</span>
              <button
                type="button"
                className="mm-safety-chip light"
                onClick={() => setIsSafetyOpen(false)}
              >
                {texts.safetySkip}
              </button>
            </div>
            <div className="mm-safety-subtitle">{texts.safetySubtitle}</div>
            <div className="mm-safety-fields">
              <input
                className="mm-safety-input"
                placeholder={texts.safetyYourName}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                className="mm-safety-input"
                placeholder={texts.safetyPersonLabel}
                value={safetyInfo.contactName}
                onChange={(e) =>
                  setSafetyInfo((prev) => ({
                    ...prev,
                    contactName: e.target.value,
                  }))
                }
              />
              <input
                className="mm-safety-input"
                placeholder={texts.safetyRelationLabel}
                value={safetyInfo.relation}
                onChange={(e) =>
                  setSafetyInfo((prev) => ({
                    ...prev,
                    relation: e.target.value,
                  }))
                }
              />
              <input
                className="mm-safety-input"
                placeholder={texts.safetyContactLabel}
                value={safetyInfo.contactDetail}
                onChange={(e) =>
                  setSafetyInfo((prev) => ({
                    ...prev,
                    contactDetail: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mm-safety-actions">
              <button
                type="button"
                className="mm-safety-chip primary"
                onClick={handleSaveSafety}
              >
                {texts.safetySave}
              </button>
            </div>
            {safetySaved && (
              <div className="mm-safety-saved">{texts.safetySavedNote}</div>
            )}
          </section>
        )}

        {/* INPUT */}
        <div className="mm-input-row">
          <input
            className="mm-input"
            placeholder="Type or use the mic to speak…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            type="button"
            className="mm-input-send"
            onClick={handleSend}
          >
            Send →
          </button>
        </div>

        {/* MODAL FOR PHQ / GAD */}
        {activeTest && (
          <div className="mm-modal-backdrop" onClick={closeModal}>
            <div className="mm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mm-modal-header">
                <div>
                  <div className="mm-modal-title">
                    {activeTest === "PHQ"
                      ? "PHQ-9 Mood Check"
                      : "GAD-7 Anxiety Check"}
                  </div>
                  <div className="mm-modal-tagline">{texts.testTagline}</div>
                </div>
                <button className="mm-modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="mm-modal-body">
                <div className="mm-progress">
                  <div
                    className="mm-progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mm-question-count">
                  <span>
                    Question {currentIndex + 1} of {currentQuestions.length}
                  </span>
                  <span>
                    Score so far:{" "}
                    {answers.reduce((sum, v) => sum + (v ?? 0), 0) ?? 0}
                  </span>
                </div>

                <div className="mm-question-text">
                  {currentQuestions[currentIndex]}
                </div>

                <div className="mm-options">
                  {OPTION_LABELS.map((label, score) => {
                    const selected = answers[currentIndex] === score;
                    return (
                      <button
                        key={label}
                        type="button"
                        className={`mm-option-btn ${
                          selected ? "selected" : ""
                        }`}
                        onClick={() => handleOptionSelect(score)}
                      >
                        <span className="mm-label">{label}</span>
                        <span className="mm-score-tag">{score} pts</span>
                      </button>
                    );
                  })}
                </div>

                {latestScore && latestScore.type === activeTest && (
                  <ScoreCard
                    type={latestScore.type}
                    score={latestScore.score}
                    max={latestScore.max}
                    severity={latestScore.severity}
                    message={latestScore.message}
                  />
                )}
              </div>

              <div className="mm-modal-footer">
                <div className="mm-text-soft">
                  You can pause anytime. Your answers stay only on this device.
                </div>
                <div className="mm-modal-actions">
                  <button
                    type="button"
                    className="mm-nav-btn back"
                    disabled={currentIndex === 0}
                    onClick={goBack}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="mm-nav-btn primary"
                    disabled={answers[currentIndex] == null}
                    onClick={goNext}
                  >
                    {currentIndex === currentQuestions.length - 1
                      ? "Finish & show score"
                      : "Next →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WELLNESS MODAL: GROUNDING / BREATHING */}
        {activeTool && !activeTest && (
          <div className="mm-modal-backdrop" onClick={closeToolModal}>
            <div className="mm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mm-modal-header">
                <div>
                  <div className="mm-modal-title">
                    {activeTool === "GROUNDING"
                      ? texts.groundingTitle
                      : texts.breathingTitle}
                  </div>
                  <div className="mm-modal-tagline">
                    {activeTool === "GROUNDING" ? texts.groundingHint : ""}
                  </div>
                </div>
                <button className="mm-modal-close" onClick={closeToolModal}>
                  ✕
                </button>
              </div>

              <div className="mm-modal-body">
                {activeTool === "GROUNDING" ? (
                  <div className="mm-wellness-block">
                    {texts.groundingBody}
                  </div>
                ) : (
                  <div className="mm-wellness-block">
                    <div className="mm-breathe-circle">
                      <div>
                        {texts.breathingTitle}
                        <br />
                        #{breathCount}
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>{texts.breathingBody}</div>
                    <div className="mm-wellness-note">
                      {texts.breathingSafetyNote}
                    </div>
                    <div className="mm-wellness-actions">
                      <button
                        type="button"
                        className="mm-nav-btn back"
                        onClick={closeToolModal}
                      >
                        {texts.wellnessClose}
                      </button>
                      <button
                        type="button"
                        className="mm-nav-btn primary"
                        onClick={() => setBreathCount((c) => c + 1)}
                      >
                        {breathCount >= 4
                          ? texts.breathingDone
                          : texts.breathingNext}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {activeTool === "GROUNDING" && (
                <div className="mm-modal-footer">
                  <div className="mm-text-soft">
                    If your mind wanders, that’s okay — just gently come back to
                    the next sense.
                  </div>
                  <div className="mm-modal-actions">
                    <button
                      type="button"
                      className="mm-nav-btn primary"
                      onClick={closeToolModal}
                    >
                      {texts.wellnessClose}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
