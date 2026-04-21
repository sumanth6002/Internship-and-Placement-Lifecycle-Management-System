import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    
    const highestRes = await connection.execute(
      `SELECT NVL(MAX(a.offer_ctc_lpa), 0) AS HIGHEST_LPA
       FROM application a
       JOIN opening o ON o.opening_id = a.opening_id
       WHERE o.opp_type = 'PLACEMENT'
         AND a.status IN ('OFFERED', 'ACCEPTED')
         AND a.offer_ctc_lpa IS NOT NULL`
    );
    
    const branchRes = await connection.execute(
      `WITH placed AS (
         SELECT DISTINCT s.student_id, s.branch
         FROM application a
         JOIN student s ON s.student_id = a.student_id
         JOIN opening o ON o.opening_id = a.opening_id
         WHERE a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT'
       ),
       all_stu AS (
         SELECT branch, COUNT(*) AS total_students
         FROM student
         GROUP BY branch
       )
       SELECT a.branch AS BRANCH,
              COUNT(p.student_id) AS PLACED_STUDENTS,
              a.total_students AS TOTAL_STUDENTS,
              ROUND(100.0 * COUNT(p.student_id) / NULLIF(a.total_students, 0), 2) AS PLACEMENT_PCT
       FROM all_stu a
       LEFT JOIN placed p ON p.branch = a.branch
       GROUP BY a.branch, a.total_students`
    );

    const openRes = await connection.execute(
      `SELECT COUNT(*) AS CNT FROM opening WHERE status = 'OPEN'`
    );

    const companyRes = await connection.execute(
      `SELECT c.name AS COMPANY, 
              COUNT(a.application_id) AS TOTAL_APPS, 
              COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) AS SELECTED_COUNT,
              ROUND(NVL(COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) * 100.0 / NULLIF(COUNT(a.application_id), 0), 0), 2) AS SELECTION_RATE
       FROM company c
       JOIN opening o ON c.company_id = o.company_id
       LEFT JOIN application a ON o.opening_id = a.opening_id
       GROUP BY c.name
       ORDER BY SELECTION_RATE DESC`
    );

    const totalAppsRes = await connection.execute(
      `SELECT COUNT(*) AS CNT FROM application`
    );

    // Summing placed students from branchRes
    let totalPlaced = 0;
    branchRes.rows.forEach(r => totalPlaced += r.PLACED_STUDENTS);

    return NextResponse.json({
      success: true,
      highestPackage: highestRes.rows[0].HIGHEST_LPA,
      branchStats: branchRes.rows,
      companyStats: companyRes.rows,
      openPositions: openRes.rows[0].CNT,
      totalPlaced,
      totalApplications: totalAppsRes.rows[0].CNT
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { }
    }
  }
}
