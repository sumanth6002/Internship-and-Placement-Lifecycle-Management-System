import oracledb from 'oracledb';

// Auto-convert query results from arrays to objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// Prefer Thin mode (works in serverless environments like Vercel).
// Some versions expose `thin` as read-only; avoid crashing at import time.
try {
  if ('thin' in oracledb) {
    // eslint-disable-next-line no-param-reassign
    oracledb.thin = true;
  }
} catch {
  // Thin mode is the default unless Thick mode is initialized.
}

export async function getConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });
    return connection;
  } catch (error) {
    console.error("Oracle Connection Error: ", error);
    throw error;
  }
}
