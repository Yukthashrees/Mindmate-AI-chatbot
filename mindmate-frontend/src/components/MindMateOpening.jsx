import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// MindMateOpening.jsx
// Usage: <MindMateOpening onFinish={() => setShowChat(true)} quote="Your quote here" colorScheme={0} />
// colorScheme: 0..3 presets

const COLOR_SCHEMES = [
  {
    bg: "from-indigo-400 via-pink-300 to-yellow-300",
    accent: "bg-gradient-to-r from-indigo-500 to-pink-400",
  },
  {
    bg: "from-green-300 via-teal-300 to-blue-300",
    accent: "bg-gradient-to-r from-green-400 to-blue-400",
  },
  {
    bg: "from-pink-300 via-purple-300 to-indigo-200",
    accent: "bg-gradient-to-r from-pink-400 to-indigo-400",
  },
  {
    bg: "from-rose-200 via-amber-200 to-lime-200",
    accent: "bg-gradient-to-r from-rose-300 to-lime-300",
  },
];

export default function MindMateOpening({
  onFinish = () => {},
  quote = "Small steps every day lead to big changes.",
  colorScheme = 0,
  duration = 3500,
}) {
  const scheme = COLOR_SCHEMES[colorScheme % COLOR_SCHEMES.length];

  useEffect(() => {
    const t = setTimeout(() => onFinish(), duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-gradient-to-br ${scheme.bg}`}
        aria-label="MindMate opening animation"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 12, duration: 0.9 }}
          className="max-w-3xl w-full text-center">

          {/* Logo + name card */}
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mx-auto inline-flex items-center gap-4 rounded-2xl p-4 shadow-2xl bg-white/70 backdrop-blur-md"
            style={{ maxWidth: 560 }}
          >
            <motion.div
              initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`flex h-16 w-16 items-center justify-center rounded-xl shadow-md text-white font-bold text-lg ${scheme.accent}`}
            >
              MM
            </motion.div>

            <div className="text-left">
              <h1 className="text-2xl font-extrabold leading-tight text-slate-900">MindMate</h1>
              <p className="text-sm text-slate-700">Gentle, private check-ins</p>
            </div>
          </motion.div>

          {/* Quote card */}
          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 mx-auto rounded-xl p-6 shadow-lg bg-white/80 backdrop-blur-md"
            style={{ maxWidth: 620 }}>
            <p className="text-lg md:text-xl font-medium text-slate-800">{quote}</p>
            <p className="mt-3 text-sm text-slate-600">Take a deep breath — you’re doing better than you think.</p>
          </motion.div>

          {/* Progress / subtle flourish */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 0.6, 1] }}
            transition={{ delay: 1.6, duration: 1.0, ease: "easeOut" }}
            className="mt-8 h-2 w-72 mx-auto origin-left rounded-full overflow-hidden bg-white/30"
          >
            <div className={`h-full rounded-full ${scheme.accent}`} style={{ width: '100%' }} />
          </motion.div>

          {/* Tap to continue hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{ delay: 2.6, duration: 1.6, repeat: Infinity }}
            className="mt-6 text-sm text-slate-700"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/60">Welcome — tap anywhere to continue</span>
          </motion.div>

          {/* Click handler overlay */}
          <button
            aria-label="Skip opening and go to app"
            onClick={() => onFinish()}
            className="absolute inset-0 w-full h-full opacity-0"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
