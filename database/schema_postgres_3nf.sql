-- ============================================================================
-- GSO Integrated Services Operations and E-Ticketing System
-- Optimised Database Schema (Third Normal Form - 3NF) for PostgreSQL
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

-- ----------------------------------------------------------------------------
-- 1. CORE & REFERENCE TABLES
-- ----------------------------------------------------------------------------

-- Units Table (FGMU, LEAU, SSU)
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (Supports Students, Employees, Admins, Directors, Superadmins)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY, -- UUID string
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NULL,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(30),
    role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'employee', 'admin', 'director', 'superadmin')),
    unit_id INT NULL REFERENCES units(id) ON DELETE SET NULL,
    student_id_number VARCHAR(50) NULL UNIQUE,
    student_type VARCHAR(50) NULL CHECK (student_type IS NULL OR student_type IN ('rso', 'ssg')),
    organization_name VARCHAR(150) NULL,
    id_card_image TEXT NULL,
    avatar_path VARCHAR(255) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Rejected', 'Suspended', 'Deactivated')),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_unit_id ON users(unit_id);

-- Personnel Table (Field Staff, Plumbers, Electricians, Gardeners)
CREATE TABLE IF NOT EXISTS personnel (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'working', 'on_leave')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_personnel_unit_status ON personnel(unit_id, status);

-- Personnel Categories Table
CREATE TABLE IF NOT EXISTS personnel_categories (
    id SERIAL PRIMARY KEY,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    supported_services TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_category_unit UNIQUE (unit_id, name)
);



-- ----------------------------------------------------------------------------
-- 2. CORE TICKET SYSTEM (Base Entity)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(60) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    service_type VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'resolved', 'closed', 'declined', 'cancelled')),
    status_label VARCHAR(100) NOT NULL DEFAULT 'Pending Approval',
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    is_approval_delayed BOOLEAN NOT NULL DEFAULT FALSE,
    approval_delay_reason TEXT NULL,
    approval_delayed_at TIMESTAMP WITH TIME ZONE NULL,
    approval_delayed_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    verification_status VARCHAR(50) NOT NULL DEFAULT 'pending_report' CHECK (verification_status IN ('pending_report', 'pending_verification', 'verified_closed')),
    accomplishment_report_path VARCHAR(255) NULL,
    accomplishment_notes TEXT NULL,
    verified_by_user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE NULL,
    decline_reason TEXT NULL,
    current_step INT NOT NULL DEFAULT 1,
    eodb_tier VARCHAR(50) NULL,
    eodb_days INT DEFAULT 3,
    target_completion_date TIMESTAMP WITH TIME ZONE NULL,
    location VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    materials_logged BOOLEAN NOT NULL DEFAULT FALSE,
    is_labor_only BOOLEAN NOT NULL DEFAULT FALSE,
    materials_stage VARCHAR(20) NOT NULL DEFAULT 'none',
    is_under_investigation BOOLEAN NOT NULL DEFAULT FALSE,
    ssu_notation TEXT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_project BOOLEAN NOT NULL DEFAULT FALSE,
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
    overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_unit_status ON tickets(unit_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_archived ON tickets(is_archived);
CREATE INDEX IF NOT EXISTS idx_tickets_approval_delayed ON tickets(is_approval_delayed);
CREATE INDEX IF NOT EXISTS idx_tickets_submitted ON tickets(submitted_at);
CREATE INDEX IF NOT EXISTS idx_tickets_investigating ON tickets(unit_id, is_under_investigation, is_archived);

-- Atomic Ticket Attachments (1NF Compliance)
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NULL,
    file_size_bytes BIGINT NULL,
    is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
    encryption_iv VARCHAR(64) NULL,
    encryption_tag VARCHAR(64) NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attachments_ticket ON ticket_attachments(ticket_id);

-- ----------------------------------------------------------------------------
-- 3. UNIT-SPECIFIC REQUEST DETAILS (1-to-1 Subtypes)
-- ----------------------------------------------------------------------------

-- FGMU Specific Details
CREATE TABLE IF NOT EXISTS fgmu_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    college_building VARCHAR(255) NOT NULL,
    office_room VARCHAR(100) NOT NULL,
    source_of_fund VARCHAR(150) NULL,
    jr_no VARCHAR(60) NULL
);

-- LEAU Specific Details
CREATE TABLE IF NOT EXISTS leau_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    college_building VARCHAR(255) NOT NULL,
    office_room VARCHAR(100) NOT NULL,
    source_of_fund VARCHAR(150) NULL
);



-- SSU Incident Reports Base Details
CREATE TABLE IF NOT EXISTS ssu_incident_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    other_incident TEXT NULL,
    other_information TEXT NULL,
    follow_up BOOLEAN NOT NULL DEFAULT FALSE,
    who_involved TEXT NULL,
    where_occurred TEXT NOT NULL,
    when_occurred VARCHAR(150) NOT NULL,
    how_narrative TEXT NOT NULL,
    reporter_name VARCHAR(255) NOT NULL,
    reporter_signature TEXT NULL
);

-- Lookup Table for Incident Types (Normalized 1NF/3NF)
CREATE TABLE IF NOT EXISTS ssu_incident_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(150) UNIQUE NOT NULL
);

-- Bridge Table: Ticket to Incident Types
CREATE TABLE IF NOT EXISTS ssu_incident_type_items (
    ticket_id VARCHAR(60) NOT NULL REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    incident_type_id INT NOT NULL REFERENCES ssu_incident_types(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, incident_type_id)
);

-- Lookup Table for Incident Issues/Information
CREATE TABLE IF NOT EXISTS ssu_incident_issues (
    id SERIAL PRIMARY KEY,
    issue_name VARCHAR(150) UNIQUE NOT NULL
);

-- Bridge Table: Ticket to Incident Issues
CREATE TABLE IF NOT EXISTS ssu_incident_issue_items (
    ticket_id VARCHAR(60) NOT NULL REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    issue_id INT NOT NULL REFERENCES ssu_incident_issues(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, issue_id)
);

-- Lookup Table for Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(150) UNIQUE NOT NULL
);

-- Bridge Table: Ticket to Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_role_items (
    ticket_id VARCHAR(60) NOT NULL REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES ssu_incident_roles(id) ON DELETE CASCADE,
    PRIMARY KEY (ticket_id, role_id)
);



-- ----------------------------------------------------------------------------
-- 4. DISPATCHING, ASSIGNMENTS & MATERIALS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_assignments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    personnel_id VARCHAR(36) NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    implementation_date VARCHAR(100) NULL,
    working_days INT NULL,
    overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    is_reassigned BOOLEAN NOT NULL DEFAULT FALSE,
    reassigned_from_id VARCHAR(36) NULL REFERENCES personnel(id) ON DELETE SET NULL,
    reassigned_reason TEXT NULL,
    dispatcher_notes TEXT NULL,
    task_notes VARCHAR(255) NULL,
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    queue_order INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    dispatched_at TIMESTAMP WITH TIME ZONE NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_assignments_ticket ON ticket_assignments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_assignments_personnel ON ticket_assignments(personnel_id);
CREATE INDEX IF NOT EXISTS idx_assignments_reassigned_from ON ticket_assignments(reassigned_from_id);

-- Atomic Job Materials Used (1NF Compliance - replaces materials JSON array)
CREATE TABLE IF NOT EXISTS ticket_materials (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NULL REFERENCES tickets(id) ON DELETE CASCADE,
    assignment_id INT NULL REFERENCES ticket_assignments(id) ON DELETE SET NULL,
    material_name VARCHAR(200) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1.00,
    unit_measurement VARCHAR(50) NULL,
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(20) NOT NULL DEFAULT 'assessment',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_materials_ticket ON ticket_materials(ticket_id);
CREATE INDEX IF NOT EXISTS idx_materials_assignment ON ticket_materials(assignment_id);

-- ----------------------------------------------------------------------------
-- 5. PERFORMANCE EVALUATION & FEEDBACK (3NF Normalized)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_feedbacks (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completion_status VARCHAR(30) NOT NULL CHECK (completion_status IN ('on-time', 'beyond-time', 'not-completed')),
    courtesy_rating SMALLINT NOT NULL DEFAULT 5 CHECK (courtesy_rating BETWEEN 1 AND 5),
    quality_rating SMALLINT NOT NULL DEFAULT 5 CHECK (quality_rating BETWEEN 1 AND 5),
    efficiency_rating SMALLINT NOT NULL DEFAULT 5 CHECK (efficiency_rating BETWEEN 1 AND 5),
    timeliness_rating SMALLINT NOT NULL DEFAULT 5 CHECK (timeliness_rating BETWEEN 1 AND 5),
    cleanliness_rating SMALLINT NOT NULL DEFAULT 5 CHECK (cleanliness_rating BETWEEN 1 AND 5),
    remarks TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_ticket ON ticket_feedbacks(ticket_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user ON ticket_feedbacks(user_id);

-- Lookup Table for Feedback Delay / Failure Reasons
CREATE TABLE IF NOT EXISTS feedback_delay_reasons (
    id SERIAL PRIMARY KEY,
    reason_code VARCHAR(60) UNIQUE NOT NULL,
    reason_label VARCHAR(200) NOT NULL
);

-- Bridge Table: Feedback to Delay Reasons
CREATE TABLE IF NOT EXISTS ticket_feedback_delay_items (
    feedback_id INT NOT NULL REFERENCES ticket_feedbacks(id) ON DELETE CASCADE,
    delay_reason_id INT NOT NULL REFERENCES feedback_delay_reasons(id) ON DELETE CASCADE,
    PRIMARY KEY (feedback_id, delay_reason_id)
);

-- ----------------------------------------------------------------------------
-- 6. AUDIT TRAILS & SYSTEM HISTORY LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_logs (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_ticket ON ticket_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON ticket_logs(created_at);

-- Account Activities & Authentication Security Audit Trail (RA 10173 Compliant)
CREATE TABLE IF NOT EXISTS account_activity_logs (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    target_user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(60) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'notice', 'warning', 'critical')),
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    device_summary VARCHAR(100) NULL,
    details TEXT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_act_logs_actor ON account_activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_act_logs_target ON account_activity_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_act_logs_event ON account_activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_act_logs_severity ON account_activity_logs(severity);
CREATE INDEX IF NOT EXISTS idx_act_logs_created ON account_activity_logs(created_at);

-- ----------------------------------------------------------------------------
-- 7. INITIAL REFERENCE SEEDS
-- ----------------------------------------------------------------------------

INSERT INTO units (id, code, name, description) VALUES 
(1, 'FGMU', 'Facilities and Grounds Management Unit', 'Manages structure, finishes, utilities, mechanical, and carpentry repairs across BSU campus.'),
(2, 'LEAU', 'Landscape and Environment Aesthetics Unit', 'Responsible for campus landscaping, janitorial services, lawn mowing, and disinfection operations.'),
(3, 'SSU', 'Security Service Unit', 'Handles university security, campus safety coordination, and campus incident reporting.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ssu_incident_types (id, type_name) VALUES
(1, 'Theft / Robbery'),
(2, 'Vandalism / Property Damage'),
(3, 'Physical Assault / Altercation'),
(4, 'Trespassing / Unauthorized Entry'),
(5, 'Road Accident / Vehicular Collision'),
(6, 'Medical Emergency / Injury'),
(7, 'Fire / Hazard Alert'),
(8, 'Other Security Concern')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ssu_incident_issues (id, issue_name) VALUES
(1, 'Lost / Stolen Personal Belongings'),
(2, 'Damaged University Facilities / Equipment'),
(3, 'Safety Policy Violation'),
(4, 'Traffic Regulation Violation'),
(5, 'Suspicious Activity Observed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ssu_incident_roles (id, role_name) VALUES
(1, 'Victim / Complainant'),
(2, 'Eyewitness'),
(3, 'Security Officer on Duty'),
(4, 'Responding Personnel')
ON CONFLICT (id) DO NOTHING;

INSERT INTO feedback_delay_reasons (id, reason_code, reason_label) VALUES
(1, 'personnelAbsent', 'Assigned personnel was absent or unavailable'),
(2, 'extendedBreak', 'Personnel took extended breaks during the repair/task'),
(3, 'additionalWork', 'Unexpected additional work or complications arose'),
(4, 'lackDays', 'Insufficient number of days allotted for the job scope'),
(5, 'lackMaterials', 'Delay due to lack of replacement parts or materials'),
(6, 'lackSkills', 'Required specialized tools or external expertise')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence generators where necessary
SELECT pg_catalog.setval('units_id_seq', (SELECT MAX(id) FROM units), true);
SELECT pg_catalog.setval('ssu_incident_types_id_seq', (SELECT MAX(id) FROM ssu_incident_types), true);
SELECT pg_catalog.setval('ssu_incident_issues_id_seq', (SELECT MAX(id) FROM ssu_incident_issues), true);
SELECT pg_catalog.setval('ssu_incident_roles_id_seq', (SELECT MAX(id) FROM ssu_incident_roles), true);
SELECT pg_catalog.setval('feedback_delay_reasons_id_seq', (SELECT MAX(id) FROM feedback_delay_reasons), true);

-- Single Active User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_sessions_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_sid ON user_sessions(session_id);

-- Account Activities Audit Trail (Security & Authentication events, RA 10173 compliant)
CREATE TABLE IF NOT EXISTS account_activity_logs (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    target_user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(80) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'NOTICE', 'WARNING', 'CRITICAL')),
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    device_summary VARCHAR(150) NULL,
    details TEXT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_act_logs_actor ON account_activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_act_logs_target ON account_activity_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_act_logs_event ON account_activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_act_logs_severity ON account_activity_logs(severity);
CREATE INDEX IF NOT EXISTS idx_act_logs_created ON account_activity_logs(created_at);
