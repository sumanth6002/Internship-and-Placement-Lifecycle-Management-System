'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(res => res.json()),
      fetch('/api/reports').then(res => res.json())
    ]).then(([statsData, reportsData]) => {
      if (statsData.success) setStats(statsData);
      if (reportsData.success) setReports(reportsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (!stats) return <div className="glass-panel" style={{ color: '#ef4444' }}>Error loading dashboard data. Check database connection.</div>;

  // Combine data for the dual-axis chart
  const combinedChartData = stats.branchStats?.map(s => {
    const reportMatch = reports?.branchAverages?.find(r => r.BRANCH === s.BRANCH);
    return {
      name: s.BRANCH,
      PlacementPercent: s.PLACEMENT_PCT,
      AvgPackageLPA: reportMatch ? reportMatch.AVG_PACKAGE : 0
    };
  }) || [];

  return (
    <div>
      <h1 className="gradient-text">Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Highest Package (LPA)</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>₹{stats.highestPackage || 0}L</h2>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Active Openings</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.openPositions}</h2>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Students Placed</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalPlaced}</h2>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Applications</h3>
          <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{stats.totalApplications}</h2>
        </div>
      </div>

      {/* New Charting Section */}
      <div className="glass-panel" style={{ marginBottom: '40px', height: '400px' }}>
         <h2 style={{ marginBottom: '20px' }}>Placement % vs Average Salary by Branch</h2>
         <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" label={{ value: 'Placement %', angle: -90, position: 'insideLeft', fill: '#3b82f6' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Salary (LPA)', angle: -90, position: 'insideRight', fill: '#10b981' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="PlacementPercent" name="Placement %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="AvgPackageLPA" name="Average LPA" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
         </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
        {/* Branch-wise Placements */}
        <div>
          <h2 style={{ marginBottom: '16px' }}>Branch-wise Placements (%)</h2>
          <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Placed</th>
                  <th>Placement %</th>
                </tr>
              </thead>
              <tbody>
                {stats.branchStats?.map((stat, i) => (
                  <tr key={stat.BRANCH || i}>
                    <td><strong>{stat.BRANCH}</strong></td>
                    <td>{stat.PLACED_STUDENTS} / {stat.TOTAL_STUDENTS}</td>
                    <td style={{ width: '40%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', flex: 1, overflow: 'hidden' }}>
                          <div style={{ background: 'var(--primary)', height: '100%', width: stat.PLACEMENT_PCT + '%' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>{stat.PLACEMENT_PCT}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company-wise Stats */}
        <div>
          <h2 style={{ marginBottom: '16px' }}>Company Recruitment Stats</h2>
          <div className="glass-panel" style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Apps</th>
                  <th>Selected</th>
                  <th>Selection Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.companyStats?.map((c, i) => (
                  <tr key={i}>
                    <td><strong>{c.COMPANY}</strong></td>
                    <td>{c.TOTAL_APPS}</td>
                    <td>{c.SELECTED_COUNT}</td>
                    <td style={{ width: '35%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', flex: 1, overflow: 'hidden' }}>
                          <div style={{ background: '#10b981', height: '100%', width: c.SELECTION_RATE + '%' }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>{c.SELECTION_RATE}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h1 className="gradient-text" style={{ marginTop: '50px' }}>Analytical Reports</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr) minmax(300px, 1fr)', gap: '20px', marginBottom: '40px' }}>
        
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Top 3 Highest Packages</h3>
          {reports?.topPackages?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {reports.topPackages.map((t, idx) => (
                <li key={idx} style={{ padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{idx+1}. {t.STUDENT_NAME} <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({t.COMPANY})</span></span>
                  <strong style={{ color: '#10b981' }}>₹{t.PACKAGE_LPA}L</strong>
                </li>
              ))}
            </ul>
          ) : <div style={{ color: 'var(--text-muted)' }}>No placed students yet.</div>}
        </div>

        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Branch Salary Statistics</h3>
          {reports?.branchAverages?.length > 0 ? (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                  <th style={{ paddingBottom: '8px', color: 'var(--text-muted)' }}>Branch</th>
                  <th style={{ paddingBottom: '8px', color: 'var(--text-muted)' }}>Average (LPA)</th>
                  <th style={{ paddingBottom: '8px', color: 'var(--text-muted)' }}>Median (LPA)</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.95rem' }}>
                {reports.branchAverages.map((b, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px 0' }}><strong>{b.BRANCH}</strong></td>
                    <td style={{ padding: '8px 0', color: '#10b981' }}>₹{b.AVG_PACKAGE}</td>
                    <td style={{ padding: '8px 0', color: '#f59e0b' }}>₹{b.MEDIAN_PACKAGE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div style={{ color: 'var(--text-muted)' }}>No placements yet.</div>}
        </div>

        <div className="glass-panel" style={{ maxHeight: '250px', overflowY: 'auto' }}>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Unplaced Applicants</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Students who applied but were not selected.</p>
          {reports?.unplacedStudents?.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {reports.unplacedStudents.map((u, idx) => (
                <li key={idx} style={{ padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
                  <span className="badge" style={{ padding: '2px 5px', zoom: 0.8, marginRight: '8px', minWidth: '40px', textAlign: 'center' }}>{u.BRANCH}</span> 
                  {u.STUDENT_NAME} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 'auto' }}>({u.REG_NO})</span>
                </li>
              ))}
            </ul>
          ) : <div style={{ color: 'var(--text-muted)' }}>Everyone who applied is placed or pending.</div>}
        </div>
      </div>

    </div>
  );
}
