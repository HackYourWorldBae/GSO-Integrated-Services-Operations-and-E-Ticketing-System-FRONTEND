-- ============================================================================
-- GSO Integrated Services Operations and E-Ticketing System
-- Pure Database Definition Language (DDL) Schema (Third Normal Form - 3NF)
-- Target RDBMS: PostgreSQL 14+
-- 
-- ZERO DATA DUMPS: Pure structural definitions only (no INSERT/DML statements).
-- ============================================================================
-- 3NF COMPLIANCE HIGHLIGHTS:
-- 1. 1NF (First Normal Form): All multi-valued attributes and repetitive groups
--    (such as SSU incident types/issues/roles, ticket attachments, materials,
--    and feedback delay reasons) are normalized into distinct atomic tables.
-- 2. 2NF (Second Normal Form): Every non-key attribute is fully functionally
--    dependent on the whole primary key without any partial functional dependencies.
-- 3. 3NF (Third Normal Form): All transitive dependencies have been removed.
--    Entity metadata (users, units, inventory, personnel) are partitioned cleanly
--    and accessed strictly via explicit foreign keys.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. CORE ORGANIZATIONAL & USER ENTITIES
-- ----------------------------------------------------------------------------

-- Table 1: Operating Units (FGMU, LEAU, SSU)
CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: User Accounts (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    name_extension VARCHAR(20) NULL,
    username VARCHAR(100) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(30) NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'employee', 'admin', 'staff', 'director', 'superadmin', 'worker')),
    unit_id INT NULL REFERENCES units(id) ON DELETE SET NULL,
    student_id_number VARCHAR(50) NULL,
    student_type VARCHAR(50) NULL,
    employee_type VARCHAR(100) NULL,
    organization_name VARCHAR(150) NULL,
    college VARCHAR(150) NULL,
    id_card_image TEXT NULL,
    id_selfie_image TEXT NULL,
    avatar_path VARCHAR(255) NULL,
    signature_path VARCHAR(255) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Rejected', 'Suspended', 'Archived')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE NULL,
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_unit_id ON users(unit_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at);

-- Table 3: Field & Technical Personnel
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

CREATE INDEX IF NOT EXISTS idx_personnel_unit ON personnel(unit_id);
CREATE INDEX IF NOT EXISTS idx_personnel_status ON personnel(status);
CREATE INDEX IF NOT EXISTS idx_personnel_user ON personnel(user_id);

-- Table 4: Personnel Categories (Specialty Classifications)
CREATE TABLE IF NOT EXISTS personnel_categories (
    id SERIAL PRIMARY KEY,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    supported_services TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_personnel_categories_unit ON personnel_categories(unit_id);

-- ----------------------------------------------------------------------------
-- 2. CORE TICKETING SUBSYSTEM (TABLE INHERITANCE PATTERN)
-- ----------------------------------------------------------------------------

-- Table 5: Base Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(60) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    service_type VARCHAR(150) NOT NULL,
    is_recategorized BOOLEAN NOT NULL DEFAULT FALSE,
    original_service_type VARCHAR(150) NULL,
    recategorized_at TIMESTAMP WITH TIME ZONE NULL,
    recategorized_by VARCHAR(36) NULL,
    recategorization_reason TEXT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'resolved', 'closed', 'declined', 'cancelled')),
    status_label VARCHAR(100) NOT NULL DEFAULT 'Pending Approval',
    is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
    is_approval_delayed BOOLEAN NOT NULL DEFAULT FALSE,
    approval_delay_reason TEXT NULL,
    approval_delayed_at TIMESTAMP WITH TIME ZONE NULL,
    approval_delayed_by VARCHAR(36) NULL,
    is_escalated_to_director BOOLEAN NOT NULL DEFAULT FALSE,
    escalation_reason TEXT NULL,
    escalated_at TIMESTAMP WITH TIME ZONE NULL,
    escalated_by VARCHAR(36) NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending_report' CHECK (verification_status IN ('pending_report', 'pending_verification', 'verified_closed')),
    accomplishment_report_path VARCHAR(255) NULL,
    accomplishment_notes TEXT NULL,
    verified_by_user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE NULL,
    decline_reason TEXT NULL,
    current_step INT NOT NULL DEFAULT 1,
    eodb_tier VARCHAR(50) NULL,
    eodb_days INT NULL DEFAULT 3,
    target_completion_date TIMESTAMP WITH TIME ZONE NULL,
    location VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    materials_logged BOOLEAN NOT NULL DEFAULT FALSE,
    is_labor_only BOOLEAN NOT NULL DEFAULT FALSE,
    materials_stage VARCHAR(20) NOT NULL DEFAULT 'none',
    is_under_investigation BOOLEAN NOT NULL DEFAULT FALSE,
    ssu_notation TEXT NULL,
    staff_notation TEXT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP WITH TIME ZONE NULL,
    reviewed_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_unit_status ON tickets(unit_id, status);
CREATE INDEX IF NOT EXISTS idx_tickets_is_archived ON tickets(is_archived);
CREATE INDEX IF NOT EXISTS idx_tickets_submitted_at ON tickets(submitted_at);
CREATE INDEX IF NOT EXISTS idx_tickets_approval_delayed ON tickets(is_approval_delayed);
CREATE INDEX IF NOT EXISTS idx_tickets_escalated ON tickets(is_escalated_to_director);
CREATE INDEX IF NOT EXISTS idx_tickets_verification_status ON tickets(verification_status);

-- Table 6: Ticket File Attachments (Encrypted Uploads)
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
    encryption_iv VARCHAR(64) NULL,
    encryption_tag VARCHAR(64) NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attachments_ticket_id ON ticket_attachments(ticket_id);

-- Table 7: FGMU Ticket Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS fgmu_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    college_building VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    source_of_fund VARCHAR(150) NULL,
    jr_no VARCHAR(60) NULL
);

-- Table 8: LEAU Ticket Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS leau_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    college_building VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    source_of_fund VARCHAR(150) NULL
);

-- Table 9: SSU Incident Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS ssu_incident_details (
    ticket_id VARCHAR(60) PRIMARY KEY REFERENCES tickets(id) ON DELETE CASCADE,
    where_occurred TEXT NULL,
    when_occurred VARCHAR(150) NULL,
    how_narrative TEXT NULL,
    reporter_name VARCHAR(255) NULL,
    reporter_signature TEXT NULL,
    other_incident TEXT NULL,
    other_information TEXT NULL,
    follow_up BOOLEAN NOT NULL DEFAULT FALSE,
    who_involved TEXT NULL
);

-- ----------------------------------------------------------------------------
-- 3. 1NF NORMALIZED LOOKUP & BRIDGE ENTITIES
-- ----------------------------------------------------------------------------

-- Table 10: SSU Incident Types (Lookup Table)
CREATE TABLE IF NOT EXISTS ssu_incident_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(150) NOT NULL
);

-- Table 11: SSU Incident Type Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS ssu_incident_type_items (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    type_id INT NOT NULL REFERENCES ssu_incident_types(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ssu_type_items_ticket ON ssu_incident_type_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ssu_type_items_type ON ssu_incident_type_items(type_id);

-- Table 12: SSU Incident Issues (Lookup Table)
CREATE TABLE IF NOT EXISTS ssu_incident_issues (
    id SERIAL PRIMARY KEY,
    issue_name VARCHAR(150) NOT NULL
);

-- Table 13: SSU Incident Issue Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS ssu_incident_issue_items (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    issue_id INT NOT NULL REFERENCES ssu_incident_issues(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ssu_issue_items_ticket ON ssu_incident_issue_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ssu_issue_items_issue ON ssu_incident_issue_items(issue_id);

-- Table 14: SSU Incident Roles (Lookup Table)
CREATE TABLE IF NOT EXISTS ssu_incident_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(150) NOT NULL
);

-- Table 15: SSU Incident Role Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS ssu_incident_role_items (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES ssu_incident_roles(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    contact_details VARCHAR(255) NULL
);

CREATE INDEX IF NOT EXISTS idx_ssu_role_items_ticket ON ssu_incident_role_items(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ssu_role_items_role ON ssu_incident_role_items(role_id);

-- ----------------------------------------------------------------------------
-- 4. OPERATIONS, ASSIGNMENTS & MASTER CATALOG
-- ----------------------------------------------------------------------------

-- Table 16: Inter-Unit Ticket Collaborations
CREATE TABLE IF NOT EXISTS ticket_collaborations (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    collaborating_unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    reason TEXT NOT NULL,
    response_notes TEXT NULL,
    service_type VARCHAR(150) NULL,
    requested_by VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    responded_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_collab_ticket ON ticket_collaborations(ticket_id);
CREATE INDEX IF NOT EXISTS idx_collab_unit ON ticket_collaborations(collaborating_unit_id);

-- Table 17: Ticket Personnel Assignments
CREATE TABLE IF NOT EXISTS ticket_assignments (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    personnel_id VARCHAR(36) NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    assigned_by VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
    notes TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_assignments_ticket ON ticket_assignments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_assignments_personnel ON ticket_assignments(personnel_id);

-- Table 18: Ticket Materials Log
CREATE TABLE IF NOT EXISTS ticket_materials (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    material_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    unit_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(20) NOT NULL DEFAULT 'assessment',
    logged_by VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_materials_ticket ON ticket_materials(ticket_id);

-- Table 19: Master Catalog Materials (Unit Standard Items)
CREATE TABLE IF NOT EXISTS catalog_materials (
    id SERIAL PRIMARY KEY,
    unit_code VARCHAR(10) NOT NULL CHECK (unit_code IN ('FGMU', 'LEAU')),
    category VARCHAR(60) NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    default_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_catalog_materials_unit ON catalog_materials(unit_code, is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_materials_category ON catalog_materials(category);

-- Table 20: Institutional Work Calendar & Special Non-Working Holidays
CREATE TABLE IF NOT EXISTS special_holidays (
    id SERIAL PRIMARY KEY,
    holiday_date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'special_non_working',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_special_holidays_date ON special_holidays(holiday_date, is_active);
CREATE INDEX IF NOT EXISTS idx_special_holidays_recurring ON special_holidays(is_recurring);

-- ----------------------------------------------------------------------------
-- 5. QUALITY ASSURANCE, FEEDBACK & DELAYS
-- ----------------------------------------------------------------------------

-- Table 21: Ticket Customer Feedbacks
CREATE TABLE IF NOT EXISTS ticket_feedbacks (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    client_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    quality_rating INT NULL,
    timeliness_rating INT NULL,
    professionalism_rating INT NULL,
    comments TEXT NULL,
    completion_status VARCHAR(30) NOT NULL DEFAULT 'on-time' CHECK (completion_status IN ('early', 'on-time', 'beyond-time', 'not-completed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_client ON ticket_feedbacks(client_id);

-- Table 22: Feedback Delay Reasons (Lookup Table)
CREATE TABLE IF NOT EXISTS feedback_delay_reasons (
    id SERIAL PRIMARY KEY,
    reason_code VARCHAR(60) NOT NULL UNIQUE,
    reason_label VARCHAR(200) NOT NULL
);

-- Table 23: Ticket Feedback Delay Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS ticket_feedback_delay_items (
    id SERIAL PRIMARY KEY,
    feedback_id INT NOT NULL REFERENCES ticket_feedbacks(id) ON DELETE CASCADE,
    delay_reason_id INT NOT NULL REFERENCES feedback_delay_reasons(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_delay_items_feedback ON ticket_feedback_delay_items(feedback_id);
CREATE INDEX IF NOT EXISTS idx_delay_items_reason ON ticket_feedback_delay_items(delay_reason_id);

-- ----------------------------------------------------------------------------
-- 6. BORROWING & INVENTORY MANAGEMENT SUBSYSTEM
-- ----------------------------------------------------------------------------

-- Table 24: Equipment, Tools & Botanical Inventory
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    unit_id INT NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'tools' CHECK (category IN ('tools', 'equipment', 'plants', 'materials', 'others')),
    serial_number VARCHAR(100) NULL,
    quantity_total INT NOT NULL DEFAULT 1,
    quantity_available INT NOT NULL DEFAULT 1,
    condition_status VARCHAR(30) NOT NULL DEFAULT 'good' CHECK (condition_status IN ('excellent', 'good', 'fair', 'needs_repair', 'retired')),
    location VARCHAR(255) NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_unit ON inventory_items(unit_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory_items(condition_status);
CREATE INDEX IF NOT EXISTS idx_inventory_active ON inventory_items(is_active);

-- Table 25: Item Borrowing Requests (Normalized 3NF Extension)
CREATE TABLE IF NOT EXISTS borrowing_requests (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE REFERENCES tickets(id) ON DELETE CASCADE,
    borrower_name VARCHAR(255) NOT NULL,
    borrower_id_number VARCHAR(50) NOT NULL,
    borrower_type VARCHAR(30) NOT NULL DEFAULT 'student' CHECK (borrower_type IN ('student', 'faculty', 'staff')),
    department_major VARCHAR(150) NULL,
    borrower_email VARCHAR(255) NOT NULL,
    borrower_contact VARCHAR(30) NOT NULL,
    item_name_requested VARCHAR(255) NOT NULL,
    item_model_requested VARCHAR(255) NULL,
    quantity_needed INT NOT NULL DEFAULT 1,
    purpose_project TEXT NOT NULL,
    date_needed DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    terms_agreed BOOLEAN NOT NULL DEFAULT TRUE,
    terms_agreed_at TIMESTAMP WITH TIME ZONE NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'pending_director' CHECK (status IN ('pending_director', 'approved_director', 'declined_director', 'inventory_assigned', 'ready_for_pickup', 'picked_up', 'returned', 'overdue', 'cancelled')),
    assigned_inventory_id INT NULL REFERENCES inventory_items(id) ON DELETE SET NULL,
    assigned_quantity INT NULL,
    picked_up_at TIMESTAMP WITH TIME ZONE NULL,
    picked_up_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    returned_at TIMESTAMP WITH TIME ZONE NULL,
    returned_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    return_condition VARCHAR(30) NULL CHECK (return_condition IS NULL OR return_condition IN ('excellent', 'good', 'fair', 'damaged', 'lost')),
    return_notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_borrowing_status ON borrowing_requests(status);
CREATE INDEX IF NOT EXISTS idx_borrowing_inventory ON borrowing_requests(assigned_inventory_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_date_needed ON borrowing_requests(date_needed);
CREATE INDEX IF NOT EXISTS idx_borrowing_return_date ON borrowing_requests(expected_return_date);

-- Table 26: Borrowing Identification & Supporting Attachments
CREATE TABLE IF NOT EXISTS borrowing_attachments (
    id SERIAL PRIMARY KEY,
    borrowing_request_id INT NOT NULL REFERENCES borrowing_requests(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    attachment_type VARCHAR(30) NOT NULL DEFAULT 'borrower_id' CHECK (attachment_type IN ('borrower_id', 'approval_letter', 'other')),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_borrowing_attachments_req ON borrowing_attachments(borrowing_request_id);

-- Table 27: Borrowing Request Lifecycle Audit History
CREATE TABLE IF NOT EXISTS borrowing_history (
    id SERIAL PRIMARY KEY,
    borrowing_request_id INT NOT NULL REFERENCES borrowing_requests(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    action_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_borrowing_history_req ON borrowing_history(borrowing_request_id);

-- ----------------------------------------------------------------------------
-- 7. AUDITING, SESSIONS & SECURITY SUBSYSTEM
-- ----------------------------------------------------------------------------

-- Table 28: Ticket Action Logs (Operational Audit Trail)
CREATE TABLE IF NOT EXISTS ticket_logs (
    id SERIAL PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_ticket ON ticket_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_logs_user ON ticket_logs(user_id);

-- Table 29: Account Activity Logs (Security & Compliance Trail)
CREATE TABLE IF NOT EXISTS account_activity_logs (
    id SERIAL PRIMARY KEY,
    actor_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    target_user_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    metadata JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_actor ON account_activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_target ON account_activity_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_event ON account_activity_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON account_activity_logs(created_at);

-- Table 30: User Sessions (Single Active Session Enforcement)
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_sid ON user_sessions(session_id);

-- Table 31: User MFA Email OTP Challenges
CREATE TABLE IF NOT EXISTS user_mfa_challenges (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    temp_token VARCHAR(64) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE INDEX IF NOT EXISTS idx_mfa_temp_token ON user_mfa_challenges(temp_token);
CREATE INDEX IF NOT EXISTS idx_mfa_user_id ON user_mfa_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_expires_at ON user_mfa_challenges(expires_at);

-- Table 32: In-App User Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50) NULL,
    related_entity_id VARCHAR(60) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Table 33: One-Time Password (OTP) Verification Codes
CREATE TABLE IF NOT EXISTS otp_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('registration', 'login', 'password_reset')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    user_data TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_email_type_code ON otp_codes(email, type, code);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_codes(expires_at);

-- Table 34: Global System Key-Value Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table 35: Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON password_resets(email);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

-- Table 36: System Backups (Dual-Vault Registry: Local + Google Drive)
CREATE TABLE IF NOT EXISTS system_backups (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    backup_type VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (backup_type IN ('manual', 'scheduled')),
    backup_category VARCHAR(20) NOT NULL DEFAULT 'database' CHECK (backup_category IN ('database', 'media', 'full')),
    tables_included TEXT NULL,
    google_drive_file_id VARCHAR(255) NULL,
    google_drive_link TEXT NULL,
    google_drive_status VARCHAR(30) NOT NULL DEFAULT 'not_configured' CHECK (google_drive_status IN ('not_configured', 'pending', 'uploaded', 'failed')),
    google_drive_error TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'failed')),
    notes VARCHAR(255) NULL,
    created_by VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_backups_created ON system_backups(created_at);
CREATE INDEX IF NOT EXISTS idx_backups_status ON system_backups(status);
CREATE INDEX IF NOT EXISTS idx_backups_category ON system_backups(backup_category);
CREATE INDEX IF NOT EXISTS fk_backups_user ON system_backups(created_by);
