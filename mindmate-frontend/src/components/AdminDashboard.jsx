import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

/* ---------- DASHBOARD STYLES ---------- */
const DASHBOARD_STYLES = `
  :root {
    --bg-gradient: radial-gradient(circle at top, #ffe5ec 0, #e0f4ff 35%, #f5f0ff 70%, #fff 100%);
    --glass: rgba(255, 255, 255, 0.92);
    --glass-border: 1px solid rgba(255, 255, 255, 0.6);
    --primary: #7b5cff;
    --text-main: #1f2335;
    --text-soft: #6b7280;
    --danger-bg: #fee2e2;
    --danger-text: #991b1b;
    --success-bg: #d1fae5;
    --success-text: #065f46;
    --shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  body { margin: 0; font-family: 'Quicksand', system-ui, sans-serif; background: var(--bg-gradient); color: var(--text-main); }

  /* LAYOUT */
  .dash-container { min-height: 100vh; padding: 20px; display: flex; justify-content: center; }
  .dash-shell { width: 100%; max-width: 1280px; display: flex; flex-direction: column; gap: 24px; }
  
  /* LOGIN */
  .login-box {
    margin: auto; width: 100%; max-width: 400px;
    background: var(--glass); border: var(--glass-border);
    padding: 32px; border-radius: 24px; box-shadow: var(--shadow);
    text-align: center; backdrop-filter: blur(12px);
  }
  .login-input { width: 100%; padding: 12px; margin-bottom: 12px; border-radius: 12px; border: 1px solid #ddd; outline: none; transition: 0.2s; }
  .login-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(123, 92, 255, 0.1); }
  .login-btn { width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .login-btn:hover { opacity: 0.9; transform: translateY(-1px); }

  /* HEADER */
  .dash-header { display: flex; justify-content: space-between; align-items: center; background: var(--glass); padding: 16px 24px; border-radius: 20px; box-shadow: var(--shadow); border: var(--glass-border); }
  .dash-title h1 { margin: 0; font-size: 24px; font-weight: 700; color: var(--text-main); }
  .dash-title p { margin: 4px 0 0; font-size: 13px; color: var(--text-soft); }
  .logout-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px 16px; border-radius: 99px; cursor: pointer; font-weight: 600; font-size: 12px; transition: 0.2s; }
  .logout-btn:hover { background: #fecaca; }

  /* STATS GRID */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .stat-card { background: white; padding: 20px; border-radius: 18px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.04); display: flex; flex-direction: column; }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-soft); font-weight: 600; }
  .stat-value { font-size: 28px; font-weight: 800; margin-top: 8px; color: var(--text-main); }

  /* SECTIONS */
  .section-card { background: var(--glass); border-radius: 24px; padding: 24px; box-shadow: var(--shadow); border: var(--glass-border); }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .section-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  
  /* ALERTS */
  .alert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .alert-item { background: #fff1f2; border: 1px solid #fecaca; padding: 16px; border-radius: 16px; position: relative; transition: 0.2s; }
  .alert-item:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(225, 29, 72, 0.1); }
  .alert-tag { position: absolute; top: 12px; right: 12px; background: #e11d48; color: white; font-size: 10px; padding: 2px 8px; border-radius: 99px; font-weight: 700; }
  .alert-user { font-weight: 700; color: #881337; margin-bottom: 4px; }
  .alert-meta { font-size: 12px; color: #9f1239; margin-bottom: 12px; }
  .safety-box { background: rgba(255,255,255,0.6); padding: 8px 12px; border-radius: 8px; font-size: 11px; color: #881337; border: 1px solid rgba(0,0,0,0.05); }

  /* DATA TABLE */
  .table-container { overflow-x: auto; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .data-table th { text-align: left; padding: 14px 16px; color: var(--text-soft); border-bottom: 1px solid #eee; font-weight: 600; background: rgba(249,250,251,0.5); }
  .data-table td { padding: 14px 16px; border-bottom: 1px solid #f3f4f6; color: var(--text-main); }
  .data-table tr:hover td { background: rgba(243,244,246, 0.5); }
  
  /* BADGES */
  .badge { padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .badge.severe { background: var(--danger-bg); color: var(--danger-text); }
  .badge.moderate { background: #ffedd5; color: #9a3412; }
  .badge.mild { background: #fef3c7; color: #92400e; }
  .badge.minimal { background: var(--success-bg); color: var(--success-text); }
  
  /* CONTROLS */
  .filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
  .search-input { padding: 8px 16px; border-radius: 99px; border: 1px solid #e5e7eb; font-size: 13px; width: 240px; outline: none; }
  .refresh-btn { background: var(--primary); color: white; border: none; padding: 8px 20px; border-radius: 99px; cursor: pointer; font-size: 12px; font-weight: 600; }

  @media (max-width: 768px) {
    .dash-header { flex-direction: column; gap: 12px; align-items: flex-start; }
    .logout-btn { align-self: flex-end; }
  }
`;

const API_BASE = "http://localhost:5000";

export default function AdminDashboard() {
  // --- STATE ---
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("mindmateAdminKey") || "");
  const [loginError, setLoginError] = useState("");
  
  const [summary, setSummary] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = !!adminKey;

  // --- STYLE INJECTION ---
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = DASHBOARD_STYLES;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // --- API ACTIONS ---
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
        setLoginError(data.error || "Invalid Credentials");
        return;
      }
      setAdminKey(data.adminKey);
      localStorage.setItem("mindmateAdminKey", data.adminKey);
      setPassword("");
    } catch (err) {
      setLoginError("Server Connection Failed");
    }
  };

  const loadData = async () => {
    if (!adminKey) return;
    setIsLoading(true);
    try {
      // Parallel Fetch
      const [sumRes, alertRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/summary`, { headers: { "x-admin-key": adminKey } }),
        fetch(`${API_BASE}/api/admin/alerts?handled=false`, { headers: { "x-admin-key": adminKey } })
      ]);

      const sumData = await sumRes.json();
      if (sumData.ok) setSummary(sumData);

      const alertData = await alertRes.json();
      if (alertData.ok) setAlerts(alertData.items || []);

      await fetchAssessments();
    } catch (e) {
      console.error("Dashboard Sync Error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    const url = new URL(`${API_BASE}/api/admin/assessments`);
    if (clientFilter.trim()) url.searchParams.set("clientId", clientFilter);
    url.searchParams.set("limit", "50");

    const res = await fetch(url.toString(), { headers: { "x-admin-key": adminKey } });
    const data = await res.json();
    if (data.ok) setAssessments(data.items || []);
  };

  useEffect(() => {
    if (isLoggedIn) loadData();
  }, [isLoggedIn]);

  // --- CHART DATA PREP ---
  const chartData = useMemo(() => {
    return [...assessments]
      .filter((a) => a.score != null)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((a) => ({
        date: new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        PHQ: a.type === "PHQ" ? a.score : null,
        GAD: a.type === "GAD" ? a.score : null,
      }));
  }, [assessments]);

  // --- RENDER HELPERS ---
  const getSeverityBadge = (key) => {
    const colors = {
      minimal: "minimal",
      mild: "mild",
      moderate: "moderate",
      severe: "severe"
    };
    return <span className={`badge ${colors[key] || "mild"}`}>{key || "Unknown"}</span>;
  };

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="dash-container" style={{ alignItems: 'center' }}>
        <div className="login-box">
          <h2 style={{ marginBottom: 10 }}>MindMate Doctor Portal</h2>
          <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Secure access for medical professionals</p>
          <form onSubmit={handleLogin}>
            <input
              className="login-input"
              type="password"
              placeholder="Enter Admin Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-btn" type="submit">Access Dashboard</button>
          </form>
          {loginError && <div style={{ color: '#ef4444', marginTop: 12, fontSize: 13 }}>⚠️ {loginError}</div>}
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="dash-container">
      <div className="dash-shell">
        
        {/* HEADER */}
        <header className="dash-header">
          <div className="dash-title">
            <h1>Clinical Dashboard</h1>
            <p>Overview of patient screenings and risk alerts</p>
          </div>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
             {isLoading && <span style={{fontSize:12, color:'#666'}}>Syncing...</span>}
             <button onClick={() => { setAdminKey(""); localStorage.removeItem("mindmateAdminKey"); }} className="logout-btn">
               Sign Out
             </button>
          </div>
        </header>

        {/* SUMMARY STATS */}
        {summary && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Patients</span>
              <span className="stat-value" style={{color:'#7b5cff'}}>{summary.totalUsers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Assessments Run</span>
              <span className="stat-value">{summary.totalAssessments}</span>
            </div>
            <div className="stat-card" style={{borderColor: summary.severeAssessments > 0 ? '#fecaca' : 'transparent'}}>
              <span className="stat-label" style={{color: summary.severeAssessments > 0 ? '#dc2626' : ''}}>High Risk Flags</span>
              <span className="stat-value" style={{color: summary.severeAssessments > 0 ? '#dc2626' : ''}}>{summary.severeAssessments}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Avg. PHQ-9 Score</span>
              <span className="stat-value">{summary.avgPHQ ? summary.avgPHQ.toFixed(1) : '-'}</span>
            </div>
          </div>
        )}

        {/* ALERTS SECTION */}
        <section className="section-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="section-header">
             <div className="section-title" style={{color:'#991b1b'}}>
               ⚠️ Immediate Attention Required ({alerts.length})
             </div>
          </div>
          
          {alerts.length === 0 ? (
            <div style={{textAlign:'center', padding:20, color:'#065f46', background:'#ecfdf5', borderRadius:12}}>
              ✅ No outstanding high-risk alerts.
            </div>
          ) : (
            <div className="alert-grid">
              {alerts.map(alert => (
                <div key={alert._id} className="alert-item">
                   <div className="alert-tag">High Risk</div>
                   <div className="alert-user">{alert.userName || "Anonymous User"}</div>
                   <div className="alert-meta">
                     ID: {alert.clientId} • {new Date(alert.createdAt).toLocaleString()}
                   </div>
                   <div style={{fontSize:13, marginBottom:8}}>
                     <strong>{alert.assessmentType} Score:</strong> {alert.score}/{alert.max}
                   </div>
                   {alert.safetyContact && (
                     <div className="safety-box">
                       <strong>Safety Contact:</strong><br/>
                       {alert.safetyContact.contactName} ({alert.safetyContact.relation})<br/>
                       {alert.safetyContact.contactDetail}
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CHARTS */}
        <section className="section-card">
          <div className="section-header">
            <div className="section-title">📊 Symptom Trends (Last 30 Days)</div>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPhq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                <YAxis fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <Tooltip 
                  contentStyle={{borderRadius:12, border:'none', boxShadow:'0 10px 20px rgba(0,0,0,0.1)'}} 
                />
                <Legend />
                <Area type="monotone" dataKey="PHQ" stroke="#8884d8" fillOpacity={1} fill="url(#colorPhq)" name="Depression (PHQ-9)" />
                <Area type="monotone" dataKey="GAD" stroke="#82ca9d" fillOpacity={1} fill="url(#colorGad)" name="Anxiety (GAD-7)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ASSESSMENTS TABLE */}
        <section className="section-card">
          <div className="section-header">
             <div className="section-title">📋 Assessment History</div>
             <div className="filter-bar">
               <input 
                 className="search-input"
                 placeholder="Search by Client ID..."
                 value={clientFilter}
                 onChange={(e) => setClientFilter(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && fetchAssessments()}
               />
               <button className="refresh-btn" onClick={loadData}>Refresh</button>
             </div>
          </div>
          
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Client ID</th>
                  <th>Assessment</th>
                  <th>Score</th>
                  <th>Severity Rating</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => (
                  <tr key={a._id}>
                    <td>{new Date(a.createdAt).toLocaleDateString()} <span style={{color:'#999', fontSize:11}}>{new Date(a.createdAt).toLocaleTimeString()}</span></td>
                    <td style={{fontFamily:'monospace', color:'#6b7280'}}>{a.clientId}</td>
                    <td>
                      <span style={{fontWeight:600, color: a.type==='PHQ'?'#7b5cff':'#059669'}}>
                        {a.type === 'PHQ' ? 'PHQ-9' : 'GAD-7'}
                      </span>
                    </td>
                    <td>
                      <span style={{fontWeight:700}}>{a.score}</span> 
                      <span style={{color:'#999', fontSize:11}}>/{a.max}</span>
                    </td>
                    <td>{getSeverityBadge(a.severityKey)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {assessments.length === 0 && (
            <div style={{padding:40, textAlign:'center', color:'#999'}}>
              No assessments found matching your filter.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}