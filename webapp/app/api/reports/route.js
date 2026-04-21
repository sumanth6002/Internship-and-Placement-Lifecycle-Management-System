import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    
    // Branch-wise average salary package 
    const branchRes = await connection.execute(
      `SELECT s.branch AS BRANCH, 
              ROUND(AVG(a.offer_ctc_lpa), 2) AS AVG_PACKAGE,
              ROUND(MEDIAN(a.offer_ctc_lpa), 2) AS MEDIAN_PACKAGE
       FROM application a
       JOIN student s ON s.student_id = a.student_id
       JOIN opening o ON o.opening_id = a.opening_id
       WHERE o.opp_type = 'PLACEMENT' AND a.status = 'ACCEPTED' AND a.offer_ctc_lpa IS NOT NULL
       GROUP BY s.branch
       ORDER BY AVG_PACKAGE DESC`
    );

    // Top 3 highest packages
    const topPackagesRes = await connection.execute(
      `SELECT * FROM (
         SELECT s.full_name AS STUDENT_NAME, c.name AS COMPANY, a.offer_ctc_lpa AS PACKAGE_LPA
         FROM application a
         JOIN student s ON s.student_id = a.student_id
         JOIN opening o ON o.opening_id = a.opening_id
         JOIN company c ON c.company_id = o.company_id
         WHERE o.opp_type = 'PLACEMENT' AND a.status IN ('OFFERED', 'ACCEPTED') AND a.offer_ctc_lpa IS NOT NULL
         ORDER BY a.offer_ctc_lpa DESC
       ) WHERE ROWNUM <= 3`
    );

    // Unplaced students who applied (have at least one REJECTED application) but no ACCEPTED placements
    const unplacedRes = await connection.execute(
      `SELECT s.reg_no AS REG_NO, s.full_name AS STUDENT_NAME, s.branch AS BRANCH
       FROM student s
       WHERE EXISTS (SELECT 1 FROM application a WHERE a.student_id = s.student_id AND a.status = 'REJECTED')
         AND NOT EXISTS (
           SELECT 1 FROM application a2 
           JOIN opening o2 ON a2.opening_id = o2.opening_id 
           WHERE a2.student_id = s.student_id AND a2.status = 'ACCEPTED' AND o2.opp_type = 'PLACEMENT'
         )
       ORDER BY s.full_name`
    );

    return NextResponse.json({ 
      success: true, 
      branchAverages: branchRes.rows,
      topPackages: topPackagesRes.rows,
      unplacedStudents: unplacedRes.rows
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
