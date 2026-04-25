import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  let connection;
  try {
    const { appId } = await req.json();
    connection = await getConnection();
    const oracledb = (await import('oracledb')).default;
    
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
    
    return NextResponse.json({ success: true, message: 'Offer accepted successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
