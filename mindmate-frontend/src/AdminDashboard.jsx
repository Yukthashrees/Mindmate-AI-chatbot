// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "http://localhost:5000";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState(
    () => localStorage.getItem("mindmateAdminKey") || ""
  );
  const [loginError, setLoginError] = useState("");

  const [summary, setSummary] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [clientFilter, setClientFilter] = useState("");

  const isLoggedIn = !!adminKey;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }
      setAdminKey(data.adminKey);
      localStorage.setItem("mindmateAdminKey", data.adminKey);
      setPassword("");
    } catch (err) {
      setLoginError("Network error");
    }
  };

  const fetchSummary = async () => {
    if (!adminKey) return;
    const res = await fetch(`${API_BASE}/api/admin/summary`, {
      headers: { "x-admin-key": adminKey },
    });
    const data = await res.json();
    if (data.ok) setSummary(data);
  };

  const fetchAssessments = async () => {
    if (!adminKey) return;
    const url = new URL(`${API_BASE}/api/admin/assessments`);
    if (clientFilter.trim()) url.searchParams.set("clientId", clientFilter);
    url.searchParams.set("limit", "100");

    const res = await fetch(url.toString(), {
      headers: { "x-admin-key": adminKey },
    });
    const data = await res.json();
    if (data.ok) setAssessments(data.items || []);
  };

  const fetchAlerts = async () => {
    if (!adminKey) return;
    const res = await fetch(
      `${API_BASE}/api/admin/alerts?handled=false`,
      {
        headers: { "x-admin-key": adminKey },
      }
    );
    const data = await res.json();
    if (data.ok) setAlerts(data.items || []);
  };

  useEffect(() => {
    if (!adminKey) return;
    fetchSummary();
    fetchAssessments();
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const logout = () => {
    setAdminKey("");
    localStorage.removeItem("mindmateAdminKey");
    setSummary(null);
    setAssessments([]);
    setAlerts([]);
  };

  // Prepare chart data: sort by date ascending
  const chartData = [...assessments]
    .filter((a) => a.clientId && a.score != null)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((a) => ({
      date: new Date(a.createdAt).toLocaleDateString(),
      PHQ: a.type === "PHQ" ? a.score : null,
      GAD: a.type === "GAD" ? a.score : null,
    }));

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, #ffe5ec 0, #e0f4ff 35%, #f5f0ff 70%, #fff 100%)",
          padding: 16,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            borderRadius: 20,
            padding: 20,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 18px 40px rgba(31,35,53,0.25)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            MindMate Admin
          </h2>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
            Enter the admin password to view assessments and alerts.
          </p>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(31,35,53,0.2)",
                padding: "8px 12px",
                fontSize: 13,
              }}
            />
            <button
              type="submit"
              style={{
                borderRadius: 999,
                border: "none",
                padding: "8px 12px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #7b5cff, #2f80ed)",
                color: "#fff",
                boxShadow: "0 10px 24px rgba(47,128,237,0.5)",
              }}
            >
              Login
            </button>
          </form>
          {loginError && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#c0392b" }}>
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #ffe5ec 0, #e0f4ff 35%, #f5f0ff 70%, #fff 100%)",
        padding: 16,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "rgba(255,255,255,0.96)",
          borderRadius: 24,
          padding: 18,
          boxShadow: "0 18px 45px rgba(31,35,53,0.22)",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>MindMate Admin Dashboard</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
              View PHQ-9 / GAD-7 history, severe alerts and basic stats.
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              background: "rgba(255, 99, 132, 0.1)",
              color: "#c0392b",
            }}
          >
            Logout
          </button>
        </header>

        {/* SUMMARY CARDS */}
        {summary && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <SummaryCard
              label="Total users"
              value={summary.totalUsers}
            />
            <SummaryCard
              label="Total assessments"
              value={summary.totalAssessments}
            />
            <SummaryCard
              label="Severe scores"
              value={summary.severeAssessments}
            />
            <SummaryCard
              label="Avg PHQ score"
              value={
                summary.avgPHQ != null ? summary.avgPHQ.toFixed(1) : "—"
              }
            />
            <SummaryCard
              label="Avg GAD score"
              value={
                summary.avgGAD != null ? summary.avgGAD.toFixed(1) : "—"
              }
            />
          </div>
        )}

        {/* FILTERS */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Filter by clientId (optional)"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(31,35,53,0.2)",
              padding: "6px 10px",
              fontSize: 12,
              minWidth: 220,
            }}
          />
          <button
            onClick={() => {
              fetchAssessments();
            }}
            style={{
              borderRadius: 999,
              border: "none",
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              background:
                "linear-gradient(135deg, #7b5cff, #a474ff)",
              color: "#fff",
            }}
          >
            Refresh data
          </button>
          <span style={{ fontSize: 11, color: "#666" }}>
            Showing latest {assessments.length} assessments
          </span>
        </div>

        {/* CHART */}
        <div
          style={{
            height: 260,
            borderRadius: 18,
            padding: 10,
            background: "rgba(248,248,255,0.9)",
            marginBottom: 16,
          }}
        >
          <h4 style={{ margin: "0 0 6px 4px", fontSize: 13 }}>
            Score trend (PHQ & GAD)
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="PHQ"
                name="PHQ"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="GAD"
                name="GAD"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ALERTS */}
        <section style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 6 }}>Severe alerts (unhandled)</h3>
          {alerts.length === 0 ? (
            <p style={{ fontSize: 13, color: "#666" }}>No open alerts.</p>
          ) : (
            <div
              style={{
                maxHeight: 220,
                overflowY: "auto",
                borderRadius: 12,
                border: "1px solid rgba(31,35,53,0.1)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "rgba(123,92,255,0.05)",
                    }}
                  >
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>Client</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Score</th>
                    <th style={thStyle}>Safety contact</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a._id}>
                      <td style={tdStyle}>
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        {a.userName || "Unknown"} <br />
                        <span style={{ fontSize: 10, color: "#777" }}>
                          {a.clientId}
                        </span>
                      </td>
                      <td style={tdStyle}>{a.assessmentType}</td>
                      <td style={tdStyle}>
                        {a.score}/{a.max}
                      </td>
                      <td style={tdStyle}>
                        {a.safetyContact?.contactName || "—"}
                        {a.safetyContact?.relation
                          ? ` (${a.safetyContact.relation})`
                          : ""}
                        <br />
                        <span style={{ fontSize: 10, color: "#777" }}>
                          {a.safetyContact?.contactDetail || ""}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RAW TABLE OF ASSESSMENTS */}
        <section>
          <h3 style={{ marginBottom: 6 }}>Recent assessments</h3>
          <div
            style={{
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 12,
              border: "1px solid rgba(31,35,53,0.1)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "rgba(123,92,255,0.05)",
                  }}
                >
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>ClientId</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Score</th>
                  <th style={thStyle}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a._id}>
                    <td style={tdStyle}>
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{a.clientId}</td>
                    <td style={tdStyle}>{a.type}</td>
                    <td style={tdStyle}>
                      {a.score}/{a.max}
                    </td>
                    <td style={tdStyle}>{a.severityKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "1px solid rgba(31,35,53,0.08)",
};

const tdStyle = {
  padding: "6px 8px",
  borderBottom: "1px solid rgba(31,35,53,0.04)",
};

function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 10,
        background:
          "linear-gradient(135deg, rgba(123,92,255,0.08), rgba(255,143,183,0.08))",
        border: "1px solid rgba(255,255,255,0.9)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#555",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
