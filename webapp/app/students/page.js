'use client';
import { useEffect, useState, useMemo } from 'react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [cgpaFilter, setCgpaFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStudents(data.students);
        setLoading(false);
      });
  }, []);

  // Sort state
  const [sortConfig, setSortConfig] = useState({ key: 'REG_NO', direction: 'asc' });
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(s => {
      // Name/Reg Search
      const matchSearch = s.FULL_NAME.toLowerCase().includes(search.toLowerCase()) || 
                          s.REG_NO.toLowerCase().includes(search.toLowerCase());
      
      // Branch filter
      const matchBranch = branchFilter === 'ALL' || s.BRANCH === branchFilter;

      // CGPA Filter
      let matchCgpa = true;
      if (cgpaFilter === 'gt7') matchCgpa = s.CGPA >= 7.0;
      else if (cgpaFilter === 'gt8') matchCgpa = s.CGPA >= 8.0;
      else if (cgpaFilter === 'gt9') matchCgpa = s.CGPA >= 9.0;

      return matchSearch && matchBranch && matchCgpa;
    });

    // sorting
    return filtered.sort((a, b) => {
      let aVal = a[sortConfig.key] || '';
      let bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [students, search, branchFilter, cgpaFilter, sortConfig]);

  const uniqueBranches = Array.from(new Set(students.map(s => s.BRANCH)));

  return (
    <div>
      <h1 className="gradient-text">Students List</h1>
      
      <div className="glass-panel" style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Search Name / Reg No</label>
          <input 
            type="text" 
            placeholder="Search..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Branch</label>
          <select 
            value={branchFilter} 
            onChange={e => setBranchFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
          >
            <option value="ALL" style={{ color: 'black' }}>All Branches</option>
            {uniqueBranches.map(b => <option key={b} value={b} style={{ color: 'black' }}>{b}</option>)}
          </select>
        </div>
        <div style={{ flex: '1 1 150px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>CGPA Range</label>
          <select 
            value={cgpaFilter} 
            onChange={e => setCgpaFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
          >
            <option value="ALL" style={{ color: 'black' }}>All CGPAs</option>
            <option value="gt7" style={{ color: 'black' }}>&gt;= 7.0</option>
            <option value="gt8" style={{ color: 'black' }}>&gt;= 8.0</option>
            <option value="gt9" style={{ color: 'black' }}>&gt;= 9.0</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('REG_NO')} style={{ cursor: 'pointer' }}>Reg No. {sortConfig.key==='REG_NO' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('FULL_NAME')} style={{ cursor: 'pointer' }}>Name {sortConfig.key==='FULL_NAME' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('BRANCH')} style={{ cursor: 'pointer' }}>Branch {sortConfig.key==='BRANCH' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('CGPA')} style={{ cursor: 'pointer' }}>CGPA {sortConfig.key==='CGPA' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th>Contact</th>
                <th onClick={() => handleSort('PLACEMENT_STATUS')} style={{ cursor: 'pointer' }}>Placement Status {sortConfig.key==='PLACEMENT_STATUS' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
                <th onClick={() => handleSort('COMPANY_NAME')} style={{ cursor: 'pointer' }}>Company {sortConfig.key==='COMPANY_NAME' && (sortConfig.direction==='asc'?'↑':'↓')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStudents.map(s => (
                <tr key={s.STUDENT_ID}>
                  <td><strong>{s.REG_NO}</strong></td>
                  <td>{s.FULL_NAME}</td>
                  <td><span className="badge">{s.BRANCH}</span></td>
                  <td>
                    <span className={'badge ' + (s.CGPA >= 8 ? 'success' : 'warning')}>
                       {s.CGPA}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{s.EMAIL}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.PHONE}</div>
                  </td>
                  <td>
                    <span className={s.PLACEMENT_STATUS === 'PLACED' ? "badge success" : "badge"}>
                      {s.PLACEMENT_STATUS}
                    </span>
                  </td>
                  <td>{s.COMPANY_NAME || '-'}</td>
                </tr>
              ))}
              {filteredAndSortedStudents.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No students match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
