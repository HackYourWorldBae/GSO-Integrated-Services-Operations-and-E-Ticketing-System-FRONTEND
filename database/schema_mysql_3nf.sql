-- ============================================================================
-- GSO Integrated Services Operations and E-Ticketing System
-- Optimised Database Schema (Third Normal Form - 3NF) for MySQL
-- ============================================================================
-- 3NF COMPLIANCE HIGHLIGHTS:
-- 1. 1NF (First Normal Form): All multi-valued attributes and JSON arrays (such as
--    SSU incident types/issues/roles, ticket attachments, job materials, and
--    feedback delay reasons) have been atomicized into separate bridge/lookup tables.
-- 2. 2NF (Second Normal Form): Every non-key column is fully functionally dependent
--    on the primary key of its respective table without any partial dependencies.
-- 3. 3NF (Third Normal Form): All transitive dependencies have been removed.
--    Repeated unit details, vehicle metadata, and user/personnel profiles are cleanly
--    isolated via foreign keys (unit_id, user_id, vehicle_id, ticket_id).
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. CORE & REFERENCE TABLES
-- ----------------------------------------------------------------------------

-- Units Table (FGMU, LEAU, SSU)
CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table (Supports Students, Employees, Admins, Directors, Superadmins)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, -- CHAR(36) UUID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NULL UNIQUE,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(30),
    role ENUM('student', 'employee', 'admin', 'director', 'superadmin') NOT NULL DEFAULT 'student',
    unit_id INT UNSIGNED NULL, -- NULL for students/general employees, FK for unit admins/staff
    student_id_number VARCHAR(50) NULL UNIQUE,
    student_type VARCHAR(50) NULL,
    organization_name VARCHAR(150) NULL,
    id_card_image TEXT NULL,
    avatar_path VARCHAR(255) NULL,
    status ENUM('Active', 'Pending', 'Rejected', 'Suspended', 'Deactivated') NOT NULL DEFAULT 'Active',
    is_verified TINYINT(1) NOT NULL DEFAULT 1,
    failed_login_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    lockout_until DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personnel Table (Field Staff, Plumbers, Electricians, Gardeners)
CREATE TABLE IF NOT EXISTS personnel (
    id VARCHAR(36) PRIMARY KEY,
    unit_id INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL, -- e.g., Plumber, Electrician, Landscaper
    status ENUM('available', 'working', 'on_leave') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_personnel_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    INDEX idx_personnel_unit_status (unit_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personnel Categories Table
CREATE TABLE IF NOT EXISTS personnel_categories (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    unit_id INT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_system TINYINT(1) NOT NULL DEFAULT 0,
    supported_services TEXT NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_category_unit (unit_id, name),
    CONSTRAINT fk_categories_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------------------------------------------------------
-- 2. CORE TICKET SYSTEM (Base Entity)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(60) PRIMARY KEY, -- e.g., FGMU-TIC-42-2026
    user_id VARCHAR(36) NOT NULL,
    unit_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    service_type VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'approved', 'processing', 'resolved', 'closed', 'declined', 'cancelled') NOT NULL DEFAULT 'pending',
    status_label VARCHAR(100) NOT NULL DEFAULT 'Pending Approval',
    is_emergency TINYINT(1) NOT NULL DEFAULT 0,
    is_approval_delayed TINYINT(1) NOT NULL DEFAULT 0,
    approval_delay_reason TEXT NULL,
    approval_delayed_at DATETIME NULL,
    approval_delayed_by VARCHAR(36) NULL,
    verification_status ENUM('pending_report', 'pending_verification', 'verified_closed') NOT NULL DEFAULT 'pending_report',
    accomplishment_report_path VARCHAR(255) NULL,
    accomplishment_notes TEXT NULL,
    verified_by_user_id VARCHAR(36) NULL,
    verified_at DATETIME NULL,
    decline_reason TEXT NULL,
    current_step INT NOT NULL DEFAULT 1, -- 1: Pending, 2: Queued/Approved, 3: Processing/On Route, 4: Completed
    eodb_tier VARCHAR(50) NULL,
    eodb_days INT DEFAULT 3,
    target_completion_date DATETIME NULL,
    location VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    materials_logged TINYINT(1) NOT NULL DEFAULT 0,
    is_labor_only TINYINT(1) NOT NULL DEFAULT 0,
    materials_stage VARCHAR(20) NOT NULL DEFAULT 'none',
    -- SSU Incident Report workflow columns
    is_under_investigation TINYINT(1) NOT NULL DEFAULT 0,
    ssu_notation TEXT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(36) NULL,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_project TINYINT(1) NOT NULL DEFAULT 0,
    project_title VARCHAR(255) NULL,
    project_target_duration VARCHAR(100) NULL,
    project_target_date DATE NULL,
    project_manpower VARCHAR(255) NULL,
    project_remarks TEXT NULL,
    project_actual_start DATE NULL,
    project_actual_completion DATE NULL,
    project_working_days INT NULL,
    extension_days INT NOT NULL DEFAULT 0,
    extended_completion_date DATE NULL,
    extension_reason TEXT NULL,
    overtime_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tickets_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_tickets_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_verified_by FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_delayed_by FOREIGN KEY (approval_delayed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tickets_user (user_id),
    INDEX idx_tickets_unit_status (unit_id, status),
    INDEX idx_tickets_archived (is_archived),
    INDEX idx_tickets_approval_delayed (is_approval_delayed),
    INDEX idx_tickets_submitted (submitted_at),
    INDEX idx_tickets_investigating (unit_id, is_under_investigation, is_archived)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Atomic Ticket Attachments (1NF Compliance)
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NULL,
    file_size_bytes BIGINT UNSIGNED NULL,
    is_encrypted TINYINT(1) NOT NULL DEFAULT 0,
    encryption_iv VARCHAR(64) NULL DEFAULT NULL,
    encryption_tag VARCHAR(64) NULL DEFAULT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    INDEX idx_attachments_ticket (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. UNIT-SPECIFIC REQUEST DETAILS (1-to-1 Subtypes)
-- ----------------------------------------------------------------------------

-- FGMU Specific Details
CREATE TABLE IF NOT EXISTS fgmu_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY,
    college_building VARCHAR(255) NOT NULL,
    office_room VARCHAR(100) NOT NULL,
    source_of_fund VARCHAR(150) NULL,
    jr_no VARCHAR(60) NULL, -- Job Request Number assigned by FGMU admin
    CONSTRAINT fk_fgmu_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- LEAU Specific Details
CREATE TABLE IF NOT EXISTS leau_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY,
    college_building VARCHAR(255) NOT NULL,
    office_room VARCHAR(100) NOT NULL,
    source_of_fund VARCHAR(150) NULL,
    CONSTRAINT fk_leau_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- SSU Incident Reports Base Details
CREATE TABLE IF NOT EXISTS ssu_incident_details (
    ticket_id VARCHAR(60) PRIMARY KEY,
    other_incident TEXT NULL,
    other_information TEXT NULL,
    follow_up TINYINT(1) NOT NULL DEFAULT 0,
    who_involved TEXT NULL,
    where_occurred TEXT NOT NULL,
    when_occurred VARCHAR(150) NOT NULL,
    how_narrative TEXT NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    reporter_signature LONGTEXT NULL,
    CONSTRAINT fk_ssu_incident_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup Table for Incident Types (Normalized 1NF/3NF)
CREATE TABLE IF NOT EXISTS ssu_incident_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(150) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge Table: Ticket to Incident Types
CREATE TABLE IF NOT EXISTS ssu_incident_type_items (
    ticket_id VARCHAR(60) NOT NULL,
    incident_type_id INT NOT NULL,
    PRIMARY KEY (ticket_id, incident_type_id),
    CONSTRAINT fk_incident_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_incident_item_type FOREIGN KEY (incident_type_id) REFERENCES ssu_incident_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup Table for Incident Issues/Information
CREATE TABLE IF NOT EXISTS ssu_incident_issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_name VARCHAR(150) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge Table: Ticket to Incident Issues
CREATE TABLE IF NOT EXISTS ssu_incident_issue_items (
    ticket_id VARCHAR(60) NOT NULL,
    issue_id INT NOT NULL,
    PRIMARY KEY (ticket_id, issue_id),
    CONSTRAINT fk_issue_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_issue_item_issue FOREIGN KEY (issue_id) REFERENCES ssu_incident_issues(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup Table for Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(150) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge Table: Ticket to Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_role_items (
    ticket_id VARCHAR(60) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (ticket_id, role_id),
    CONSTRAINT fk_role_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_role_item_role FOREIGN KEY (role_id) REFERENCES ssu_incident_roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------------------------------------------------------
-- 4. DISPATCHING, ASSIGNMENTS & MATERIALS
-- ----------------------------------------------------------------------------

-- Ticket Assignments (Connects tickets to personnel)
CREATE TABLE IF NOT EXISTS ticket_assignments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    personnel_id VARCHAR(36) NOT NULL,
    implementation_date VARCHAR(100) NULL, -- Schedule/Date of work
    working_days INT NULL DEFAULT NULL,
    overtime_hours DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    is_reassigned TINYINT(1) NOT NULL DEFAULT 0,
    reassigned_from_id VARCHAR(36) NULL DEFAULT NULL,
    reassigned_reason TEXT NULL DEFAULT NULL,
    dispatcher_notes TEXT NULL,
    task_notes VARCHAR(255) NULL,
    is_emergency TINYINT(1) NOT NULL DEFAULT 0,
    queue_order INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dispatched_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    CONSTRAINT fk_assignment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_personnel FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_reassigned_from FOREIGN KEY (reassigned_from_id) REFERENCES personnel(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_assignments_ticket (ticket_id),
    INDEX idx_assignments_personnel (personnel_id),
    INDEX idx_assignments_reassigned_from (reassigned_from_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Atomic Job Materials Used (1NF Compliance - replaces materials JSON array)
CREATE TABLE IF NOT EXISTS ticket_materials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NULL DEFAULT NULL,
    assignment_id INT UNSIGNED NULL DEFAULT NULL,
    material_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_measurement VARCHAR(50) NULL, -- e.g., pcs, meters, liters
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(20) NOT NULL DEFAULT 'assessment',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materials_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_materials_assignment FOREIGN KEY (assignment_id) REFERENCES ticket_assignments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_materials_ticket (ticket_id),
    INDEX idx_materials_assignment (assignment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. PERFORMANCE EVALUATION & FEEDBACK (3NF Normalized)
-- ----------------------------------------------------------------------------

-- Unified Ticket Feedbacks Table (Applies to FGMU, LEAU, TASU, SSU without duplication)
CREATE TABLE IF NOT EXISTS ticket_feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    completion_status ENUM('on-time', 'beyond-time', 'not-completed') NOT NULL,
    courtesy_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    quality_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    efficiency_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    timeliness_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    cleanliness_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    remarks TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_feedbacks_ticket (ticket_id),
    INDEX idx_feedbacks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup Table for Feedback Delay / Failure Reasons
CREATE TABLE IF NOT EXISTS feedback_delay_reasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reason_code VARCHAR(60) UNIQUE NOT NULL, -- e.g., personnelAbsent, lackMaterials
    reason_label VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge Table: Feedback to Delay Reasons (Replaces JSON array in feedback)
CREATE TABLE IF NOT EXISTS ticket_feedback_delay_items (
    feedback_id INT NOT NULL,
    delay_reason_id INT NOT NULL,
    PRIMARY KEY (feedback_id, delay_reason_id),
    CONSTRAINT fk_delay_item_feedback FOREIGN KEY (feedback_id) REFERENCES ticket_feedbacks(id) ON DELETE CASCADE,
    CONSTRAINT fk_delay_item_reason FOREIGN KEY (delay_reason_id) REFERENCES feedback_delay_reasons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. AUDIT TRAILS & SYSTEM HISTORY LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    user_id VARCHAR(36) NULL, -- Actor who performed the action
    action VARCHAR(150) NOT NULL, -- e.g., Status Changed, Personnel Assigned, Feedback Submitted
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_logs_ticket (ticket_id),
    INDEX idx_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Account Activities & Authentication Security Audit Trail (RA 10173 Compliant)
CREATE TABLE IF NOT EXISTS account_activity_logs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(36) NULL,
    target_user_id VARCHAR(36) NULL,
    event_type VARCHAR(60) NOT NULL,
    severity ENUM('info', 'notice', 'warning', 'critical') NOT NULL DEFAULT 'info',
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    device_summary VARCHAR(100) NULL,
    details TEXT NULL,
    metadata TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_act_logs_actor (actor_id),
    INDEX idx_act_logs_target (target_user_id),
    INDEX idx_act_logs_event (event_type),
    INDEX idx_act_logs_severity (severity),
    INDEX idx_act_logs_created (created_at),
    CONSTRAINT fk_act_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_act_logs_target FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. INITIAL REFERENCE SEEDS
-- ----------------------------------------------------------------------------

INSERT IGNORE INTO units (id, code, name, description) VALUES 
(1, 'FGMU', 'Facilities and Grounds Management Unit', 'Manages structure, finishes, utilities, mechanical, and carpentry repairs across BSU campus.'),
(2, 'LEAU', 'Landscape and Environment Aesthetics Unit', 'Responsible for campus landscaping, janitorial services, lawn mowing, and disinfection operations.'),
(3, 'SSU', 'Security Service Unit', 'Handles university security, campus safety coordination, and campus incident reporting.');

INSERT IGNORE INTO ssu_incident_types (id, type_name) VALUES
(1, 'Theft / Robbery'),
(2, 'Vandalism / Property Damage'),
(3, 'Physical Assault / Altercation'),
(4, 'Trespassing / Unauthorized Entry'),
(5, 'Road Accident / Vehicular Collision'),
(6, 'Medical Emergency / Injury'),
(7, 'Fire / Hazard Alert'),
(8, 'Other Security Concern');

INSERT IGNORE INTO ssu_incident_issues (id, issue_name) VALUES
(1, 'Lost / Stolen Personal Belongings'),
(2, 'Damaged University Facilities / Equipment'),
(3, 'Safety Policy Violation'),
(4, 'Traffic Regulation Violation'),
(5, 'Suspicious Activity Observed');

INSERT IGNORE INTO ssu_incident_roles (id, role_name) VALUES
(1, 'Victim / Complainant'),
(2, 'Eyewitness'),
(3, 'Security Officer on Duty'),
(4, 'Responding Personnel');

INSERT IGNORE INTO feedback_delay_reasons (id, reason_code, reason_label) VALUES
(1, 'personnelAbsent', 'Assigned personnel was absent or unavailable'),
(2, 'extendedBreak', 'Personnel took extended breaks during the repair/task'),
(3, 'additionalWork', 'Unexpected additional work or complications arose'),
(4, 'lackDays', 'Insufficient number of days allotted for the job scope'),
(5, 'lackMaterials', 'Delay due to lack of replacement parts or materials'),
(6, 'lackSkills', 'Required specialized tools or external expertise');



-- ----------------------------------------------------------------------------
-- 8. SYSTEM / INFRASTRUCTURE TABLES
-- ----------------------------------------------------------------------------

-- Notifications (no FK on user_id — users can be deleted independently)
CREATE TABLE IF NOT EXISTS notifications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',    -- success | warning | info
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OTP Codes (email-based one-time password for registration/login)
CREATE TABLE IF NOT EXISTS otp_codes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_data TEXT NULL,   -- JSON blob of pending registration payload
    PRIMARY KEY (id),
    INDEX email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Single Active User Sessions (One session per user enforcement)
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_sessions_user (user_id),
    INDEX idx_user_sessions_sid (session_id),
    CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

