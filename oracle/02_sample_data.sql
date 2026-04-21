-- Expanded Sample Data
-- Requires 01_ddl.sql executed first.

INSERT INTO company (name, sector, hq_city) VALUES ('TechNova India', 'IT Services', 'Bengaluru');
INSERT INTO company (name, sector, hq_city) VALUES ('FinEdge Analytics', 'FinTech', 'Mumbai');
INSERT INTO company (name, sector, hq_city) VALUES ('CloudFirst Systems', 'Cloud', 'Hyderabad');
INSERT INTO company (name, sector, hq_city) VALUES ('Global Robotics', 'Manufacturing', 'Pune');
INSERT INTO company (name, sector, hq_city) VALUES ('NexWave Solutions', 'Telecommunications', 'Chennai');
INSERT INTO company (name, sector, hq_city) VALUES ('Prime Aerospace', 'Aerospace', 'Bengaluru');

-- 15 Students across CSE, ECE, MECH
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905634', 'Sumanth P Shetty', 'CSE', 'B', 8.7, 'sumanth@college.edu', '9000000001');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905068', 'Ronak K Shetty', 'CSE', 'B', 8.2, 'ronak@college.edu', '9000000002');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905100', 'Aditi Rao', 'CSE', 'B', 9.1, 'aditi@college.edu', '9000000003');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240904050', 'Kiran Mehta', 'ECE', 'A', 7.5, 'kiran@college.edu', '9000000004');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240904051', 'Rahul Deshpande', 'ECE', 'A', 6.8, 'rahul@college.edu', '9000000005');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905201', 'Priya Singh', 'CSE', 'C', 9.5, 'priya@college.edu', '9000000006');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240903001', 'Vikram Singh', 'MECH', 'A', 7.2, 'vikram@college.edu', '9000000007');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240903002', 'Anita Joshi', 'MECH', 'B', 8.0, 'anita@college.edu', '9000000008');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240903003', 'Rohan Patel', 'MECH', 'A', 6.5, 'rohan@college.edu', '9000000009');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905300', 'Meera Reddy', 'CSE', 'A', 8.8, 'meera@college.edu', '9000000010');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240904052', 'Anil Kumar', 'ECE', 'B', 8.1, 'anil@college.edu', '9000000011');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240904053', 'Neha Gupta', 'ECE', 'C', 9.2, 'neha@college.edu', '9000000012');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905301', 'Siddharth Iyer', 'CSE', 'A', 7.9, 'siddharth@college.edu', '9000000013');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240903004', 'Kavya Sharma', 'MECH', 'B', 8.5, 'kavya@college.edu', '9000000014');
INSERT INTO student (reg_no, full_name, branch, section, cgpa, email, phone) VALUES ('240905302', 'Ravi Varma', 'CSE', 'D', 6.9, 'ravi@college.edu', '9000000015');

-- 8 Openings
INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (1, 'Software Engineer — Campus', 'PLACEMENT', 7.0, 12.5, NULL, DATE '2026-05-30', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (2, 'Data Analyst Trainee', 'PLACEMENT', 7.5, 9.0, NULL, DATE '2026-06-15', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (3, 'Summer Intern — Platform', 'INTERNSHIP', 7.0, NULL, 25000, DATE '2026-04-20', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (1, 'Associate QA Engineer', 'PLACEMENT', 6.5, 8.0, NULL, DATE '2026-05-10', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (4, 'Robotics Engineer', 'PLACEMENT', 8.0, 14.0, NULL, DATE '2026-07-01', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (5, 'Network Intern', 'INTERNSHIP', 6.5, NULL, 20000, DATE '2026-06-25', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (6, 'Structural Analyst', 'PLACEMENT', 7.2, 10.5, NULL, DATE '2026-08-10', 'OPEN');

INSERT INTO opening (company_id, title, opp_type, min_cgpa, package_lpa, stipend_kpm, deadline, status)
VALUES (2, 'Financial Modeler Intern', 'INTERNSHIP', 8.5, NULL, 30000, DATE '2026-03-31', 'CLOSED');

COMMIT;
