'use client';
import { useEffect, useState } from 'react';

export default function OpeningsManagePage() {
  const [openings, setOpenings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ 
    companyId: '', title: '', oppType: 'PLACEMENT', 
    minCgpa: 7.0, packageLpa: '', stipendKpm: '', deadline: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [oRes, cRes] = await Promise.all([
      fetch('/api/openings').then(r => r.json()),
      fetch('/api/companies').then(r => r.json())
    ]);
    if (oRes.success) setOpenings(oRes.openings);
    if (cRes.success) {
      setCompanies(cRes.companies);
      if (cRes.companies.length > 0) setForm(prev => ({ ...prev, companyId: cRes.companies[0].COMPANY_ID }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/openings/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, title: '', packageLpa: '', stipendKpm: '', minCgpa: 7.0, deadline: '' });
        fetchData();
      } else {
        alert(data.error);
      }
    } catch(err) {
      alert("Error adding opening");
    }
    setIsSubmitting(false);
  };

  const handleClose = async (openingId) => {
    if (!window.confirm("Are you sure you want to close this opening?")) return;
    try {
      const res = await fetch('/api/openings/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openingId, action: 'CLOSE' })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error);
      }
    } catch(err) {
      alert("Error closing opening");
    }
  };

  // Simple sorting logic
  const [sortConfig, setSortConfig] = useState({ key: 'TITLE', direction: 'asc' });
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setOpenings([...openings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  return (
    <div>
      <h1 className="gradient-text">Openings Management</h1>
      
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h3>Create New Opening</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', alignItems: 'end', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Company</label>
            <select required value={form.companyId} onChange={e => setForm({...form, companyId: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}>
              {companies.map(c => <option key={c.COMPANY_ID} value={c.COMPANY_ID} style={{ color: 'black' }}>{c.NAME}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Title</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Type</label>
            <select value={form.oppType} onChange={e => setForm({...form, oppType: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}>
              <option value="PLACEMENT" style={{ color: 'black' }}>Placement</option>
              <option value="INTERNSHIP" style={{ color: 'black' }}>Internship</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Min CGPA</label>
            <input required type="number" step="0.1" value={form.minCgpa} onChange={e => setForm({...form, minCgpa: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Package LPA (For Placements)</label>
            <input type="number" step="0.1" value={form.packageLpa} onChange={e => setForm({...form, packageLpa: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Stipend /Mo (For Internships)</label>
            <input type="number" value={form.stipendKpm} onChange={e => setForm({...form, stipendKpm: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Deadline</label>
            <input required type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Opening'}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? <div className="spinner"></div> : (
          <table className="premium-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('COMPANY')} style={{ cursor: 'pointer' }}>Company {sortConfig.key==='COMPANY' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('TITLE')} style={{ cursor: 'pointer' }}>Title {sortConfig.key==='TITLE' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('OPP_TYPE')} style={{ cursor: 'pointer' }}>Type {sortConfig.key==='OPP_TYPE' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('DEADLINE')} style={{ cursor: 'pointer' }}>Deadline {sortConfig.key==='DEADLINE' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('STATUS')} style={{ cursor: 'pointer' }}>Status {sortConfig.key==='STATUS' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {openings.map(o => {
                const isDeadlinePassed = new Date(o.DEADLINE) < new Date();
                const actualStatus = isDeadlinePassed && o.STATUS === 'OPEN' ? 'CLOSED' : o.STATUS;
                return (
                  <tr key={o.OPENING_ID}>
                    <td><strong>{o.COMPANY}</strong></td>
                    <td>{o.TITLE}</td>
                    <td>{o.OPP_TYPE}</td>
                    <td>{new Date(o.DEADLINE).toLocaleDateString()}</td>
                    <td>
                      <span className={actualStatus === 'OPEN' ? "badge success" : "badge warning"}>
                        {actualStatus}
                      </span>
                    </td>
                    <td>
                      {actualStatus === 'OPEN' && (
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#dc3545', borderColor: '#dc3545' }} onClick={() => handleClose(o.OPENING_ID)}>
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {openings.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No openings found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
