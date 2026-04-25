import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req) {
  let connection;
  try {
    const { appId, status } = await req.json();
    connection = await getConnection();
    const oracledb = (await import('oracledb')).default;
    
    if (status === 'ACCEPTED') {
      // Must use pkg_placement.accept_offer to adhere to DB logic correctly
      const result = await connection.execute(
        `BEGIN pkg_placement.accept_offer(:a_id, :out_msg); END;`,
        { 
          a_id: appId,
          out_msg: { type: oracledb.STRING, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true }
      );
      const message = result.outBinds.out_msg || 'OK';
      if (message !== 'OK') {
        return NextResponse.json({ success: false, error: message }, { status: 400 });
      }
    } else {
      await connection.execute(
        `UPDATE application SET status = :status WHERE application_id = :id`,
        { status, id: appId },
        { autoCommit: true }
      );
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (err) {
    if (err.message && err.message.includes('ORA-20002')) {
       return NextResponse.json({ success: false, error: 'Student already placed.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
