'use client';
import { useEffect, useState } from 'react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', sector: '', hqCity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCompanies = () => {
    setLoading(true);
    fetch('/api/companies')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Sort by name by default
          setCompanies(data.companies.sort((a,b) => a.NAME.localeCompare(b.NAME)));
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', sector: '', hqCity: '' });
        fetchCompanies();
      } else {
        alert(data.error);
      }
    } catch(err) {
      alert("Error adding company");
    }
    setIsSubmitting(false);
  };

  // Simple sorting logic
  const [sortConfig, setSortConfig] = useState({ key: 'NAME', direction: 'asc' });
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCompanies([...companies].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  return (
    <div>
      <h1 className="gradient-text">Company Management</h1>
      
      <div className="glass-panel" style={{ marginBottom: '30px' }}>
        <h3>Add New Company</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) auto', gap: '15px', alignItems: 'end', marginTop: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Company Name</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sector/Industry</label>
            <input required value={form.sector} onChange={e => setForm({...form, sector: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>HQ City</label>
            <input required value={form.hqCity} onChange={e => setForm({...form, hqCity: e.target.value})} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} />
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Company'}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {loading ? <div className="spinner"></div> : (
          <table className="premium-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('NAME')} style={{ cursor: 'pointer' }}>Company Name {sortConfig.key==='NAME' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('SECTOR')} style={{ cursor: 'pointer' }}>Sector {sortConfig.key==='SECTOR' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('HQ_CITY')} style={{ cursor: 'pointer' }}>HQ City {sortConfig.key==='HQ_CITY' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('TOTAL_OPENINGS')} style={{ cursor: 'pointer' }}>Total Openings {sortConfig.key==='TOTAL_OPENINGS' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('TOTAL_HIRED')} style={{ cursor: 'pointer' }}>Total Hired {sortConfig.key==='TOTAL_HIRED' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.COMPANY_ID}>
                  <td><strong>{c.NAME}</strong></td>
                  <td>{c.SECTOR}</td>
                  <td>{c.HQ_CITY}</td>
                  <td>{c.TOTAL_OPENINGS}</td>
                  <td><span className={c.TOTAL_HIRED > 0 ? "badge success" : "badge"}>{c.TOTAL_HIRED}</span></td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No companies found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
