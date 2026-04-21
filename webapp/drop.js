const oracledb = require('oracledb');
oracledb.autoCommit = true;
async function run() {
  const conn = await oracledb.getConnection({
    user: 'system',
    password: 'ronakshettyk',
    connectString: 'localhost:1521/XE'
  });
  
  const tables = ['application_audit', 'application', 'opening', 'student', 'company'];
  for (const t of tables) {
    try {
      await conn.execute(`DROP TABLE ${t} CASCADE CONSTRAINTS`);
      console.log(`Dropped ${t}`);
    } catch(e) {
      console.log(`Could not drop ${t}: ${e.message}`);
    }
  }
  await conn.close();
}
run().catch(console.error);
