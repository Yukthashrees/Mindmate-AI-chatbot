import React, { useEffect, useRef } from "react";

/**
 * Splash screen:
 * - plays a soft SFX if available (public/splash-sfx.mp3)
 * - shows animated logo, title and motivational quote
 * - automatically finishes after ~3.6s (tweak duration)
 *
 * Props:
 *  onFinish()  -> called when splash ends
 */
export default function Splash({ onFinish }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // try to play SFX if present (browser may block autoplay unless user interacted).
    const a = audioRef.current;
    if (a) {
      // try to play - browsers may require user gesture; this will silently fail if blocked
      a.play().catch(() => { /* ignore autoplay fail */ });
    }

    // auto-finish after animation (match CSS duration)
    const t = setTimeout(() => {
      onFinish && onFinish();
    }, 3600);

    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="splash-root" role="dialog" aria-label="Welcome">
      <audio ref={audioRef} src="/splash-sfx.mp3" preload="auto" />
      <div className="splash-card">
        <div className="logo-pill">
          <div className="logo-mm">MM</div>
        </div>

        <h1 className="splash-title">MindMate</h1>

        <p className="splash-sub">Gentle, private check-ins</p>

        <blockquote className="splash-quote">
          “You’ve done something brave just by opening this. Take a breath —
          you’re not alone.”
        </blockquote>

        <div className="splash-progress" aria-hidden>
          <div className="spark" />
        </div>
      </div>
    </div>
  );
}
