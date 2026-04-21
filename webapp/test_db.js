const oracledb = require('oracledb');

async function test() {
  let connection;
  try {
    console.log("Connecting as:", process.env.ORACLE_USER, "to", process.env.ORACLE_CONNECT_STRING);
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING
    });
    console.log("Connected successfully.");
    
    const result = await connection.execute('SELECT COUNT(*) AS CNT FROM opening WHERE status = \'OPEN\'');
    console.log("Query success. Openings count:", result.rows);
  } catch(e) {
    console.error("Oracle Error:", e);
  } finally {
    if (connection) await connection.close();
  }
}
test();
