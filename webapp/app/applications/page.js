'use client';
import { useEffect, useState } from 'react';

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = () => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (data.success) setApps(data.applications);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    if (newStatus === 'ACCEPTED') {
      const confirmMsg = "Are you sure you want to mark this application as ACCEPTED? " +
                         "This will automatically assign the CTC and block the student from applying to other placements.";
      if (!window.confirm(confirmMsg)) return;
    } else {
      if (!window.confirm(`Update status to ${newStatus}?`)) return;
    }

    const res = await fetch('/api/applications/status', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ appId, status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      if (newStatus === 'ACCEPTED') alert("Offer Accepted!");
      fetchApps();
    } else {
      alert("Error: " + data.error);
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'ACCEPTED' || status === 'OFFERED') return 'badge success';
    if (status === 'REJECTED' || status === 'DECLINED') return 'badge error';
    if (status === 'INTERVIEW') return 'badge warning';
    return 'badge'; // default blue-ish for APPLIED/SHORTLISTED
  };

  // Sort state
  const [sortConfig, setSortConfig] = useState({ key: 'REG_NO', direction: 'asc' });
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setApps([...apps].sort((a, b) => {
      let aVal = a[key] || '';
      let bVal = b[key] || '';
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  return (
    <div>
      <h1 className="gradient-text">Applications Pipeline</h1>
      {loading ? <div className="spinner"></div> : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('REG_NO')} style={{ cursor: 'pointer' }}>Reg No. {sortConfig.key==='REG_NO' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('STUDENT_NAME')} style={{ cursor: 'pointer' }}>Student {sortConfig.key==='STUDENT_NAME' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('COMPANY')} style={{ cursor: 'pointer' }}>Company {sortConfig.key==='COMPANY' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('OPENING')} style={{ cursor: 'pointer' }}>Role {sortConfig.key==='OPENING' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('STATUS')} style={{ cursor: 'pointer' }}>Status {sortConfig.key==='STATUS' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('CTC')} style={{ cursor: 'pointer' }}>CTC (LPA) {sortConfig.key==='CTC' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.APP_ID}>
                  <td><strong>{a.REG_NO}</strong></td>
                  <td>{a.STUDENT_NAME}</td>
                  <td>{a.COMPANY}</td>
                  <td>{a.OPENING}</td>
                  <td>
                    <span className={getBadgeClass(a.STATUS)}>
                      {a.STATUS}
                    </span>
                  </td>
                  <td>{a.CTC ? '₹' + a.CTC + 'L' : '-'}</td>
                  <td>
                    {a.STATUS === 'ACCEPTED' ? (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Finalized</span>
                    ) : a.STATUS === 'REJECTED' ? (
                      <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>Rejected</span>
                    ) : (
                      <select 
                        onChange={(e) => {
                          if(e.target.value) handleStatusChange(a.APP_ID, e.target.value);
                          e.target.value = ""; // reset so they can toggle back and forth if needed
                        }}
                        style={{ padding: '6px', borderRadius: '4px', background: '#222', color: 'white', border: '1px solid #444' }}
                      >
                        <option value="">Update...</option>
                        {a.STATUS === 'APPLIED' && <option value="INTERVIEW">Set INTERVIEW</option>}
                        {a.STATUS === 'INTERVIEW' && (
                          <>
                            <option value="OFFERED">Set OFFERED</option>
                            <option value="REJECTED">Set REJECTED</option>
                          </>
                        )}
                        {a.STATUS === 'OFFERED' && (
                          <>
                            <option value="ACCEPTED">Set ACCEPTED</option>
                            <option value="REJECTED">Set REJECTED</option>
                          </>
                        )}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
