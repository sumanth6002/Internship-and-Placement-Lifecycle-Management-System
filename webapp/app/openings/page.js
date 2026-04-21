'use client';
import { useEffect, useState } from 'react';

export default function OpeningsPage() {
  const [openings, setOpenings] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem('selectedStudentId');
    if (savedId) setSelectedStudentId(savedId);

    Promise.all([
      fetch('/api/openings').then(r => r.json()),
      fetch('/api/students').then(r => r.json())
    ]).then(([oData, sData]) => {
      if (oData.success) {
        // Only show OPEN openings, check deadline as well
        const validOpenings = oData.openings.map(o => {
          const isPassed = new Date(o.DEADLINE) < new Date();
          if (isPassed && o.STATUS === 'OPEN') o.STATUS = 'CLOSED';
          return o;
        }).filter(o => o.STATUS === 'OPEN'); // Filter out closed openings
        
        setOpenings(validOpenings);
      }
      if (sData.success) setStudents(sData.students);
      setLoading(false);
    });
  }, []);

  const handleStudentChange = (e) => {
    const val = e.target.value;
    setSelectedStudentId(val);
    localStorage.setItem('selectedStudentId', val);
  };

  const handleApply = async (openingId) => {
    if (!selectedStudentId) {
      alert("Please select a student from the dropdown first to simulate who is applying!");
      return;
    }
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ studentId: selectedStudentId, openingId })
    });
    const data = await res.json();
    if (data.success) {
      alert("Application submitted successfully!");
    } else {
      alert("Error: " + data.error);
    }
  };

  // derived selected student object
  const currentStudent = students.find(s => s.STUDENT_ID == selectedStudentId);

  // filtered students for the dropdown
  const filteredStudents = students.filter(s => 
    s.FULL_NAME.toLowerCase().includes(searchStudent.toLowerCase()) || 
    s.REG_NO.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <h1 className="gradient-text" style={{ margin: 0 }}>Available Openings</h1>
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px 20px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '300px' }}>
           <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Apply As Account:</label>
           <input 
             type="text" 
             placeholder="Search student by name or reg no..." 
             value={searchStudent}
             onChange={e => setSearchStudent(e.target.value)}
             style={{ padding: '8px', borderRadius: '4px', background: '#222', color: 'white', border: '1px solid #555', width: '100%' }}
           />
           <select 
             style={{ padding: '8px', borderRadius: '4px', background: '#333', color: 'white', border: '1px solid #555', width: '100%' }}
             value={selectedStudentId} 
             onChange={handleStudentChange}
           >
             <option value="">-- Select Student --</option>
             {filteredStudents.map(s => <option key={s.STUDENT_ID} value={s.STUDENT_ID}>{s.REG_NO} - {s.FULL_NAME}</option>)}
           </select>
           {currentStudent && (
             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               Logged in as: <strong>{currentStudent.FULL_NAME}</strong> (CGPA: {currentStudent.CGPA})
             </div>
           )}
        </div>
      </div>

      {loading ? <div className="spinner"></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', marginTop: '20px' }}>
          {openings.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              No openings currently available.
            </div>
          )}
          {openings.map(o => {
            let disabledReason = null;
            if (currentStudent) {
              if (currentStudent.CGPA < o.MIN_CGPA) {
                disabledReason = `Not Eligible: Required CGPA ${o.MIN_CGPA}`;
              } else if (currentStudent.PLACEMENT_STATUS === 'PLACED' && o.OPP_TYPE === 'PLACEMENT') {
                disabledReason = 'Already Placed';
              }
            }

            return (
              <div key={o.OPENING_ID} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', opacity: disabledReason ? 0.7 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge warning">{o.OPP_TYPE}</span>
                  <span className={'badge success'}>{o.STATUS}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{o.TITLE}</h2>
                <div style={{ color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 500 }}>{o.COMPANY}</div>
                
                <div style={{ display: 'flex', gap: '20px', marginBottom: '10px', fontSize: '0.9rem' }}>
                  {o.PACKAGE_LPA && <div><strong>Package:</strong> ₹{o.PACKAGE_LPA} LPA</div>}
                  {o.DEADLINE && <div><strong>Deadline:</strong> {new Date(o.DEADLINE).toLocaleDateString()}</div>}
                </div>
                <div style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
                  <strong>Min CGPA:</strong> {o.MIN_CGPA || 'N/A'}
                </div>
                
                <button 
                  className="btn-primary" 
                  style={{ marginTop: 'auto', background: disabledReason ? '#555' : '', border: disabledReason ? 'none' : '', cursor: disabledReason ? 'not-allowed' : 'pointer' }}
                  onClick={() => handleApply(o.OPENING_ID)}
                  disabled={!!disabledReason}
                  title={disabledReason || ''}
                >
                  {disabledReason || 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
