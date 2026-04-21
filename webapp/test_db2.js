const oracledb = require('oracledb');

async function test() {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: 'localhost:1521/XE'
    });
    console.log("Connected to XE");
    const result = await connection.execute("SELECT owner FROM all_tables WHERE table_name = 'OPENING'");
    console.log("owners of OPENING table in XE:", result.rows);
  } catch(e) {
    console.error(e);
  } finally {
    if (connection) await connection.close();
  }
}
test();
