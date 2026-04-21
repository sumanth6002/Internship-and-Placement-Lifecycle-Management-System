const oracledb = require('oracledb');
async function run() {
  const conn = await oracledb.getConnection({
    user: 'system',
    password: 'ronakshettyk',
    connectString: 'localhost:1521/XE'
  });
  const res = await conn.execute(`SELECT s.student_id AS STUDENT_ID, s.reg_no AS REG_NO, s.full_name AS FULL_NAME FROM student s WHERE NOT EXISTS (SELECT 1 FROM application a JOIN opening o ON a.opening_id = o.opening_id WHERE a.student_id = s.student_id AND a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT') ORDER BY s.reg_no`);
  console.log(res.rows);
  await conn.close();
}
run().catch(console.error);
