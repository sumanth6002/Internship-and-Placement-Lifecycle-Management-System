let _oracledb;

async function getOracle() {
  if (_oracledb) return _oracledb;

  // Lazy-load so Next/Vercel build doesn't need to evaluate the native module.
  _oracledb = (await import('oracledb')).default;

  // Auto-convert query results from arrays to objects
  _oracledb.outFormat = _oracledb.OUT_FORMAT_OBJECT;

  // Prefer Thin mode (works in serverless environments like Vercel).
  // Some versions expose `thin` as read-only; avoid crashing at import time.
  try {
    if ('thin' in _oracledb) {
      // eslint-disable-next-line no-param-reassign
      _oracledb.thin = true;
    }
  } catch {
    // Thin mode is the default unless Thick mode is initialized.
  }

  return _oracledb;
}

export async function getConnection() {
  try {
    const oracledb = await getOracle();
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
