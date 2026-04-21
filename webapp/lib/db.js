import oracledb from 'oracledb';

// Auto-convert query results from arrays to objects
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// Force Thin mode (works in serverless environments like Vercel)
oracledb.thin = true;

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
