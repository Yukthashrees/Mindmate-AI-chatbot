// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Chat from "./Chat";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 9999,
          display: "flex",
          gap: 8,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        }}
      >
        <Link
          to="/"
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            textDecoration: "none",
            background: "rgba(123,92,255,0.1)",
            color: "#3c2c78",
          }}
        >
          User chat
        </Link>
        <Link
          to="/admin"
          style={{
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            textDecoration: "none",
            background: "rgba(255,99,132,0.12)",
            color: "#b31217",
          }}
        >
          Admin
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
