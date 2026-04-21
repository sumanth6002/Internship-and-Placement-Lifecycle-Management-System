import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import oracledb from 'oracledb';

export async function POST(req) {
  let connection;
  try {
    const { companyId, title, oppType, minCgpa, packageLpa, stipendKpm, deadline } = await req.json();
    connection = await getConnection();
    
    await connection.execute(
      `INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status) 
       VALUES (:c_id, :t, :ot, :mc, :pl, :sk, TO_DATE(:dl, 'YYYY-MM-DD'), 'OPEN')`,
      { 
        c_id: companyId, t: title, ot: oppType, mc: minCgpa,
        pl: packageLpa ? packageLpa : null, sk: stipendKpm ? stipendKpm : null,
        dl: deadline
      },
      { autoCommit: true }
    );

    return NextResponse.json({ success: true, message: 'Opening created successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}

export async function PUT(req) {
  let connection;
  try {
    const { openingId, action } = await req.json();
    connection = await getConnection();
    
    if (action === 'CLOSE') {
      await connection.execute(
        `UPDATE opening SET status = 'CLOSED' WHERE opening_id = :id`,
        { id: openingId },
        { autoCommit: true }
      );
    }
    return NextResponse.json({ success: true, message: 'Opening status updated!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
