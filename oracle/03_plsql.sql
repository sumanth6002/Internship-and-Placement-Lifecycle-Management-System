-- Packages: procedures / functions for Lab 12 (call from Java via CallableStatement)

CREATE OR REPLACE PACKAGE pkg_placement AS
  PROCEDURE submit_application (
    p_student_id    IN NUMBER,
    p_opening_id    IN NUMBER,
    p_out_app_id    OUT NUMBER,
    p_out_msg       OUT VARCHAR2
  );

  PROCEDURE accept_offer (
    p_application_id IN NUMBER,
    p_out_msg        OUT VARCHAR2
  );

  FUNCTION fn_student_eligible (
    p_student_id IN NUMBER,
    p_opening_id IN NUMBER
  ) RETURN NUMBER;

  FUNCTION fn_branch_avg_package (
    p_branch IN VARCHAR2
  ) RETURN NUMBER;

  FUNCTION fn_highest_package RETURN NUMBER;
END pkg_placement;
/

CREATE OR REPLACE PACKAGE BODY pkg_placement AS

  PROCEDURE submit_application (
    p_student_id    IN NUMBER,
    p_opening_id    IN NUMBER,
    p_out_app_id    OUT NUMBER,
    p_out_msg       OUT VARCHAR2
  ) IS
    v_cgpa   NUMBER;
    v_min    NUMBER;
    v_stat   VARCHAR2(20);
    v_type   VARCHAR2(20);
    v_cnt    NUMBER;
  BEGIN
    p_out_app_id := NULL;
    p_out_msg := NULL;

    SELECT cgpa INTO v_cgpa FROM student WHERE student_id = p_student_id;
    SELECT min_cgpa, status, opp_type
    INTO v_min, v_stat, v_type
    FROM opening WHERE opening_id = p_opening_id;

    IF v_stat <> 'OPEN' THEN
      p_out_msg := 'Opening is not active.';
      RETURN;
    END IF;

    IF v_cgpa < v_min THEN
      p_out_msg := 'CGPA below minimum for this opening.';
      RETURN;
    END IF;

    SELECT COUNT(*) INTO v_cnt FROM application
    WHERE student_id = p_student_id AND opening_id = p_opening_id;
    IF v_cnt > 0 THEN
      p_out_msg := 'Already applied to this opening.';
      RETURN;
    END IF;

    INSERT INTO application (student_id, opening_id, status)
    VALUES (p_student_id, p_opening_id, 'APPLIED')
    RETURNING application_id INTO p_out_app_id;

    p_out_msg := 'OK';
  EXCEPTION
    WHEN OTHERS THEN
      p_out_msg := 'Error: ' || SQLERRM;
  END submit_application;

  PROCEDURE accept_offer (
    p_application_id IN NUMBER,
    p_out_msg        OUT VARCHAR2
  ) IS
    v_student_id NUMBER;
    v_opening_id NUMBER;
    v_status     VARCHAR2(30);
    v_type       VARCHAR2(20);
    v_ctc        NUMBER;
    v_other      NUMBER;
  BEGIN
    p_out_msg := NULL;

    SELECT student_id, opening_id, status
    INTO v_student_id, v_opening_id, v_status
    FROM application
    WHERE application_id = p_application_id
    FOR UPDATE;

    IF v_status NOT IN ('OFFERED') THEN
      p_out_msg := 'Only OFFERED applications can be accepted.';
      RETURN;
    END IF;

    SELECT opp_type, NVL(offer_ctc_lpa, package_lpa)
    INTO v_type, v_ctc
    FROM application a
    JOIN opening o ON o.opening_id = a.opening_id
    WHERE a.application_id = p_application_id;

    IF v_type = 'PLACEMENT' THEN
      SELECT COUNT(*) INTO v_other
      FROM application a
      JOIN opening o ON o.opening_id = a.opening_id
      WHERE a.student_id = v_student_id
        AND a.application_id <> p_application_id
        AND a.status = 'ACCEPTED'
        AND o.opp_type = 'PLACEMENT';
      IF v_other > 0 THEN
        p_out_msg := 'Student already has an accepted placement offer.';
        RETURN;
      END IF;
    END IF;

    UPDATE application
    SET status = 'ACCEPTED'
    WHERE application_id = p_application_id;

    p_out_msg := 'OK';
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_out_msg := 'Application not found.';
    WHEN OTHERS THEN
      p_out_msg := 'Error: ' || SQLERRM;
  END accept_offer;

  FUNCTION fn_student_eligible (
    p_student_id IN NUMBER,
    p_opening_id IN NUMBER
  ) RETURN NUMBER IS
    v_cgpa NUMBER;
    v_min  NUMBER;
    v_stat VARCHAR2(20);
  BEGIN
    SELECT cgpa INTO v_cgpa FROM student WHERE student_id = p_student_id;
    SELECT min_cgpa, status INTO v_min, v_stat FROM opening WHERE opening_id = p_opening_id;
    IF v_stat = 'OPEN' AND v_cgpa >= v_min THEN
      RETURN 1;
    END IF;
    RETURN 0;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RETURN 0;
  END fn_student_eligible;

  FUNCTION fn_branch_avg_package (
    p_branch IN VARCHAR2
  ) RETURN NUMBER IS
    v_avg NUMBER;
  BEGIN
    SELECT AVG(a.offer_ctc_lpa)
    INTO v_avg
    FROM application a
    JOIN student s ON s.student_id = a.student_id
    JOIN opening o ON o.opening_id = a.opening_id
    WHERE s.branch = p_branch
      AND o.opp_type = 'PLACEMENT'
      AND a.status = 'ACCEPTED'
      AND a.offer_ctc_lpa IS NOT NULL;

    RETURN ROUND(NVL(v_avg, 0), 2);
  END fn_branch_avg_package;

  FUNCTION fn_highest_package RETURN NUMBER IS
    v_max NUMBER;
  BEGIN
    SELECT MAX(a.offer_ctc_lpa)
    INTO v_max
    FROM application a
    JOIN opening o ON o.opening_id = a.opening_id
    WHERE o.opp_type = 'PLACEMENT'
      AND a.status IN ('OFFERED', 'ACCEPTED')
      AND a.offer_ctc_lpa IS NOT NULL;

    RETURN NVL(v_max, 0);
  END fn_highest_package;

END pkg_placement;
/
