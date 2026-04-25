import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT a.application_id AS APP_ID, s.reg_no AS REG_NO, s.full_name AS STUDENT_NAME, 
              c.name AS COMPANY, o.title AS OPENING, a.status AS STATUS, a.offer_ctc_lpa AS CTC 
       FROM application a
       JOIN student s ON s.student_id = a.student_id
       JOIN opening o ON o.opening_id = a.opening_id
       JOIN company c ON c.company_id = o.company_id
       ORDER BY a.applied_at DESC`
    );
    return NextResponse.json({ success: true, applications: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}

export async function POST(req) {
  let connection;
  try {
    const { studentId, openingId } = await req.json();
    connection = await getConnection();
    const oracledb = (await import('oracledb')).default;
    
    const checkOpen = await connection.execute(`SELECT opp_type FROM opening WHERE opening_id = :id`, { id: openingId });
    if (checkOpen.rows.length > 0 && checkOpen.rows[0].OPP_TYPE === 'PLACEMENT') {
      const checkApp = await connection.execute(`
        SELECT 1 FROM application a
        JOIN opening o ON a.opening_id = o.opening_id
        WHERE a.student_id = :sid AND a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT'
      `, { sid: studentId });
      if (checkApp.rows.length > 0) {
         return NextResponse.json({ success: false, error: "This student has already accepted a placement offer and cannot apply to more placements." }, { status: 400 });
      }
    }

    const result = await connection.execute(
      `BEGIN pkg_placement.submit_application(:s_id, :o_id, :out_app_id, :out_msg); END;`,
      { 
        s_id: studentId, 
        o_id: openingId,
        out_app_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        out_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    const message = result.outBinds.out_msg || 'Application submitted!';
    if (message !== 'OK' && message !== 'Application submitted!') {
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: 'Application submitted!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
