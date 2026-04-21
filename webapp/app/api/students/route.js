import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT s.student_id AS STUDENT_ID, s.reg_no AS REG_NO, s.full_name AS FULL_NAME, 
              s.branch AS BRANCH, s.section AS SECTION, s.cgpa AS CGPA, s.email AS EMAIL, s.phone AS PHONE,
              (SELECT c.name FROM application a JOIN opening o ON a.opening_id = o.opening_id JOIN company c ON o.company_id = c.company_id WHERE a.student_id = s.student_id AND a.status = 'ACCEPTED' AND ROWNUM = 1) AS COMPANY_NAME,
              (SELECT CASE WHEN COUNT(*) > 0 THEN 'PLACED' ELSE 'NOT PLACED' END FROM application a WHERE a.student_id = s.student_id AND a.status = 'ACCEPTED') AS PLACEMENT_STATUS
       FROM student s ORDER BY s.reg_no`
    );
    return NextResponse.json({ success: true, students: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
