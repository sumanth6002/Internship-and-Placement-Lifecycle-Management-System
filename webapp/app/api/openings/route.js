import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    // B1 style query
    const result = await connection.execute(
      `SELECT o.opening_id AS OPENING_ID, c.name AS COMPANY, o.title AS TITLE, 
              o.opp_type AS OPP_TYPE, o.package_lpa AS PACKAGE_LPA, 
              o.min_cgpa AS MIN_CGPA, o.deadline AS DEADLINE, o.status AS STATUS
       FROM opening o
       JOIN company c ON c.company_id = o.company_id
       ORDER BY o.deadline`
    );
    return NextResponse.json({ success: true, openings: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
