-- Run after 04_triggers.sql (audit table + triggers must exist)

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'APPLIED'
FROM student s, opening o
WHERE s.reg_no = '240905634' AND o.title = 'Software Engineer — Campus';

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'SHORTLISTED'
FROM student s, opening o
WHERE s.reg_no = '240905068' AND o.title = 'Data Analyst Trainee';

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'REJECTED'
FROM student s, opening o
WHERE s.reg_no = '240905100' AND o.title = 'Software Engineer — Campus';

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'INTERVIEW'
FROM student s, opening o
WHERE s.reg_no = '240904050' AND o.title = 'Associate QA Engineer';

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'ACCEPTED'
FROM student s, opening o
WHERE s.reg_no = '240905201' AND o.title = 'Software Engineer — Campus';

INSERT INTO application (student_id, opening_id, status)
SELECT s.student_id, o.opening_id, 'ACCEPTED'
FROM student s, opening o
WHERE s.reg_no = '240903001' AND o.title = 'Summer Intern — Platform';

-- Verify constraints don't break this, 'Summer Intern - Platform' is INTERNSHIP type so accepting it shouldn't block future applications if not configured to, but here it's an internship.

-- Move one pipeline to OFFERED (offer CTC filled by trigger from opening.package_lpa)
UPDATE application
SET status = 'OFFERED'
WHERE application_id = (
  SELECT a.application_id
  FROM application a
  JOIN student s ON s.student_id = a.student_id
  JOIN opening o ON o.opening_id = a.opening_id
  WHERE s.reg_no = '240905068'
    AND o.title = 'Data Analyst Trainee'
);

COMMIT;
