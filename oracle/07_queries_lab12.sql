-- Lab 12 — Basic & complex queries (run in SQL*Plus / SQL Developer / JDBC)
-- Annotated list for your report: copy section titles into "List of SQL Queries"

/* ---------- BASIC QUERIES ---------- */

-- B1: List all open placement roles with company name
SELECT c.name AS company, o.title, o.package_lpa, o.deadline
FROM opening o
JOIN company c ON c.company_id = o.company_id
WHERE o.status = 'OPEN' AND o.opp_type = 'PLACEMENT'
ORDER BY o.deadline;

-- B2: Students in CSE with CGPA >= 8
SELECT reg_no, full_name, cgpa
FROM student
WHERE branch = 'CSE' AND cgpa >= 8
ORDER BY cgpa DESC;

-- B3: Count applications per status
SELECT status, COUNT(*) AS cnt
FROM application
GROUP BY status
ORDER BY cnt DESC;

-- B4: Join — application details with student and company
SELECT s.reg_no, s.full_name, c.name AS company, o.title, a.status
FROM application a
JOIN student s ON s.student_id = a.student_id
JOIN opening o ON o.opening_id = a.opening_id
JOIN company c ON c.company_id = o.company_id;

/* ---------- COMPLEX QUERIES ---------- */

-- C1: Branch-wise average accepted package (placement only)
SELECT s.branch,
       ROUND(AVG(a.offer_ctc_lpa), 2) AS avg_accepted_lpa
FROM application a
JOIN student s ON s.student_id = a.student_id
JOIN opening o ON o.opening_id = a.opening_id
WHERE a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT'
GROUP BY s.branch;

-- C2: Highest package among OFFERED or ACCEPTED
SELECT MAX(a.offer_ctc_lpa) AS highest_lpa
FROM application a
JOIN opening o ON o.opening_id = a.opening_id
WHERE o.opp_type = 'PLACEMENT'
  AND a.status IN ('OFFERED', 'ACCEPTED')
  AND a.offer_ctc_lpa IS NOT NULL;

-- C3: Placement percentage by branch (students with >=1 accepted placement / distinct students per branch)
WITH placed AS (
  SELECT DISTINCT s.student_id, s.branch
  FROM application a
  JOIN student s ON s.student_id = a.student_id
  JOIN opening o ON o.opening_id = a.opening_id
  WHERE a.status = 'ACCEPTED' AND o.opp_type = 'PLACEMENT'
),
all_stu AS (
  SELECT branch, COUNT(*) AS total_students
  FROM student
  GROUP BY branch
)
SELECT a.branch,
       COUNT(p.student_id) AS placed_students,
       a.total_students,
       ROUND(100.0 * COUNT(p.student_id) / NULLIF(a.total_students, 0), 2) AS placement_pct
FROM all_stu a
LEFT JOIN placed p ON p.branch = a.branch
GROUP BY a.branch, a.total_students;

-- C4: Correlated subquery — openings where applicant count exceeds branch average applications
SELECT o.opening_id, c.name, o.title,
       (SELECT COUNT(*) FROM application x WHERE x.opening_id = o.opening_id) AS apps
FROM opening o
JOIN company c ON c.company_id = o.company_id
WHERE (SELECT COUNT(*) FROM application x WHERE x.opening_id = o.opening_id) >
      (SELECT AVG(cnt) FROM (SELECT COUNT(*) cnt FROM application GROUP BY opening_id));

-- C5: Use view — company recruitment stats
SELECT * FROM vw_company_recruitment ORDER BY total_applications DESC;

-- C6: Call packaged functions (same logic as app report screen)
SELECT pkg_placement.fn_branch_avg_package('CSE') AS cse_avg FROM dual;
SELECT pkg_placement.fn_highest_package AS highest FROM dual;
