-- Views for analytics / reporting (referenced in queries doc)

CREATE OR REPLACE VIEW vw_company_recruitment AS
SELECT
  c.company_id,
  c.name AS company_name,
  COUNT(a.application_id) AS total_applications,
  SUM(CASE WHEN a.status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepts,
  SUM(CASE WHEN a.status = 'REJECTED' THEN 1 ELSE 0 END) AS rejects
FROM company c
LEFT JOIN opening o ON o.company_id = c.company_id
LEFT JOIN application a ON a.opening_id = o.opening_id
GROUP BY c.company_id, c.name;

CREATE OR REPLACE VIEW vw_branch_placement_summary AS
SELECT
  s.branch,
  COUNT(DISTINCT s.student_id) AS students_in_scope,
  SUM(CASE WHEN a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT' THEN 1 ELSE 0 END) AS placed_count,
  ROUND(AVG(CASE WHEN a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT' THEN a.offer_ctc_lpa END), 2) AS avg_package_lpa
FROM student s
LEFT JOIN application a ON a.student_id = s.student_id
LEFT JOIN opening o ON o.opening_id = a.opening_id
GROUP BY s.branch;

CREATE OR REPLACE VIEW vw_application_pipeline AS
SELECT
  a.application_id,
  s.reg_no,
  s.full_name,
  s.branch,
  c.name AS company_name,
  o.title AS role_title,
  o.opp_type,
  a.status,
  a.offer_ctc_lpa,
  a.applied_at
FROM application a
JOIN student s ON s.student_id = a.student_id
JOIN opening o ON o.opening_id = a.opening_id
JOIN company c ON c.company_id = o.company_id;
