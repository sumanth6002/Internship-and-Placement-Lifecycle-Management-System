import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(
      `SELECT c.company_id AS COMPANY_ID, c.name AS NAME, c.sector AS SECTOR, c.hq_city AS HQ_CITY, 
              COUNT(DISTINCT o.opening_id) AS TOTAL_OPENINGS,
              COUNT(CASE WHEN a.status = 'ACCEPTED' THEN 1 END) AS TOTAL_HIRED
       FROM company c
       LEFT JOIN opening o ON c.company_id = o.company_id
       LEFT JOIN application a ON o.opening_id = a.opening_id
       GROUP BY c.company_id, c.name, c.sector, c.hq_city
       ORDER BY c.name`
    );
    return NextResponse.json({ success: true, companies: result.rows });
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
    const { name, sector, hqCity } = await req.json();
    connection = await getConnection();
    
    await connection.execute(
      `INSERT INTO company (name, sector, hq_city) VALUES (:name, :sector, :hqCity)`,
      { name, sector, hqCity },
      { autoCommit: true }
    );

    return NextResponse.json({ success: true, message: 'Company created successfully!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
}
