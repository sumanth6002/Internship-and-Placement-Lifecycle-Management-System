import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(req) {
  let connection;
  try {
    const { appId } = await req.json();
    connection = await getConnection();
    
    await connection.execute(
      `UPDATE application SET status = 'OFFERED' WHERE application_id = :id AND status IN ('APPLIED', 'INTERVIEW', 'SHORTLISTED')`,
      { id: appId },
      { autoCommit: true }
    );

    return NextResponse.json({ success: true, message: 'Status updated to OFFERED' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
