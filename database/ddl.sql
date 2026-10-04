-- GSO Integrated Services Operations and E-Ticketing System
-- Data Definition Language (DDL) for MySQL / MariaDB

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- IDEMPOTENT LIVE SCHEMA MIGRATION / COLUMN PATCHER
-- ============================================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_gso_upgrade_schema` $$

CREATE PROCEDURE `sp_gso_upgrade_schema`()
BEGIN
    DECLARE current_db VARCHAR(128);
    SELECT DATABASE() INTO current_db;

    -- 1. Users Table Upgrades
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = current_db AND table_name = 'users') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'student_type') THEN
            ALTER TABLE `users` ADD COLUMN `student_type` VARCHAR(50) NULL AFTER `student_id_number`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'employee_type') THEN
            ALTER TABLE `users` ADD COLUMN `employee_type` VARCHAR(100) NULL AFTER `student_type`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'college') THEN
            ALTER TABLE `users` ADD COLUMN `college` VARCHAR(150) NULL AFTER `organization_name`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'id_selfie_image') THEN
            ALTER TABLE `users` ADD COLUMN `id_selfie_image` TEXT NULL AFTER `id_card_image`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'failed_login_attempts') THEN
            ALTER TABLE `users` ADD COLUMN `failed_login_attempts` INT(10) UNSIGNED NOT NULL DEFAULT 0 AFTER `is_verified`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'lockout_until') THEN
            ALTER TABLE `users` ADD COLUMN `lockout_until` DATETIME NULL DEFAULT NULL AFTER `failed_login_attempts`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'users' AND column_name = 'email_notifications_enabled') THEN
            ALTER TABLE `users` ADD COLUMN `email_notifications_enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Per-account opt-in for ticket/request email updates' AFTER `is_verified`;
        END IF;

        ALTER TABLE `users` MODIFY COLUMN `role` ENUM('student','employee','admin','staff','director','superadmin') NOT NULL DEFAULT 'student';
        ALTER TABLE `users` MODIFY COLUMN `status` ENUM('Active','Pending','Rejected','Suspended') NOT NULL DEFAULT 'Active';
    END IF;

    -- 2. Personnel Table Upgrades
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = current_db AND table_name = 'personnel') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'personnel' AND column_name = 'contact_number') THEN
            ALTER TABLE `personnel` DROP COLUMN `contact_number`;
        END IF;
    END IF;

    -- 3. Personnel Categories Table Upgrades
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = current_db AND table_name = 'personnel_categories') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'personnel_categories' AND column_name = 'supported_services') THEN
            ALTER TABLE `personnel_categories` ADD COLUMN `supported_services` TEXT NULL AFTER `is_system`;
        END IF;
    END IF;

    -- 4. Tickets Table Upgrades
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = current_db AND table_name = 'tickets') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'is_recategorized') THEN
            ALTER TABLE `tickets` ADD COLUMN `is_recategorized` TINYINT(1) NOT NULL DEFAULT 0 AFTER `service_type`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'original_service_type') THEN
            ALTER TABLE `tickets` ADD COLUMN `original_service_type` VARCHAR(150) DEFAULT NULL AFTER `is_recategorized`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'recategorized_at') THEN
            ALTER TABLE `tickets` ADD COLUMN `recategorized_at` DATETIME DEFAULT NULL AFTER `original_service_type`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'recategorized_by') THEN
            ALTER TABLE `tickets` ADD COLUMN `recategorized_by` VARCHAR(36) DEFAULT NULL AFTER `recategorized_at`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'recategorization_reason') THEN
            ALTER TABLE `tickets` ADD COLUMN `recategorization_reason` TEXT DEFAULT NULL AFTER `recategorized_by`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'is_emergency') THEN
            ALTER TABLE `tickets` ADD COLUMN `is_emergency` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status_label`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'is_approval_delayed') THEN
            ALTER TABLE `tickets` ADD COLUMN `is_approval_delayed` TINYINT(1) NOT NULL DEFAULT 0 AFTER `is_emergency`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'approval_delay_reason') THEN
            ALTER TABLE `tickets` ADD COLUMN `approval_delay_reason` TEXT DEFAULT NULL AFTER `is_approval_delayed`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'approval_delayed_at') THEN
            ALTER TABLE `tickets` ADD COLUMN `approval_delayed_at` DATETIME DEFAULT NULL AFTER `approval_delay_reason`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'approval_delayed_by') THEN
            ALTER TABLE `tickets` ADD COLUMN `approval_delayed_by` VARCHAR(36) DEFAULT NULL AFTER `approval_delayed_at`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'is_labor_only') THEN
            ALTER TABLE `tickets` ADD COLUMN `is_labor_only` TINYINT(1) NOT NULL DEFAULT 0 AFTER `materials_logged`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'materials_stage') THEN
            ALTER TABLE `tickets` ADD COLUMN `materials_stage` VARCHAR(20) NOT NULL DEFAULT 'none' AFTER `is_labor_only`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'is_under_investigation') THEN
            ALTER TABLE `tickets` ADD COLUMN `is_under_investigation` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'SSU only: 1 when flagged for active investigation' AFTER `materials_stage`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'tickets' AND column_name = 'ssu_notation') THEN
            ALTER TABLE `tickets` ADD COLUMN `ssu_notation` TEXT DEFAULT NULL COMMENT 'SSU only: staff recommendation/notation communicated to reporter' AFTER `is_under_investigation`;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema = current_db AND table_name = 'tickets' AND index_name = 'idx_tickets_approval_delayed') THEN
            ALTER TABLE `tickets` ADD INDEX `idx_tickets_approval_delayed` (`is_approval_delayed`);
        END IF;
    END IF;

    -- 5. Ticket Feedbacks Table Upgrades
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = current_db AND table_name = 'ticket_feedbacks') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = current_db AND table_name = 'ticket_feedbacks' AND column_name = 'early_rating') THEN
            ALTER TABLE `ticket_feedbacks` ADD COLUMN `early_rating` TINYINT(1) UNSIGNED NULL DEFAULT NULL AFTER `timeliness_rating`;
        END IF;
    END IF;

    -- 6. Drop Deprecated Tables
    DROP TABLE IF EXISTS `ci_sessions`;
    DROP TABLE IF EXISTS `role_permissions`;

END $$

DELIMITER ;

CALL `sp_gso_upgrade_schema`();
DROP PROCEDURE IF EXISTS `sp_gso_upgrade_schema`;

-- ============================================================================
-- TABLE CREATIONS (CREATE TABLE IF NOT EXISTS)
-- ============================================================================


-- Units Table
CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    contact_number VARCHAR(30) NULL,
    role ENUM('student', 'employee', 'admin', 'staff', 'director', 'superadmin') DEFAULT 'student',
    unit_id INT UNSIGNED NULL,
    student_id_number VARCHAR(50) NULL,
    student_type VARCHAR(50) NULL,
    employee_type VARCHAR(100) NULL,
    organization_name VARCHAR(150) NULL,
    college VARCHAR(150) NULL,
    id_card_image TEXT NULL,
    id_selfie_image TEXT NULL,
    avatar_path VARCHAR(255) NULL,
    status ENUM('Active', 'Pending', 'Rejected', 'Suspended') NOT NULL DEFAULT 'Active',
    is_verified TINYINT(1) NOT NULL DEFAULT 1,
    email_notifications_enabled TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Per-account opt-in for ticket/request email updates (SSU alerts, dispatch, etc.)',
    failed_login_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    lockout_until DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Personnel Table
CREATE TABLE IF NOT EXISTS personnel (
    id VARCHAR(36) PRIMARY KEY,
    unit_id INT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    status ENUM('available', 'working', 'on_leave') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
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
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TICKET SYSTEM

-- Base Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(60) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    unit_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    service_type VARCHAR(150) NOT NULL,
    is_recategorized TINYINT(1) NOT NULL DEFAULT 0,
    original_service_type VARCHAR(150) NULL DEFAULT NULL,
    recategorized_at DATETIME NULL DEFAULT NULL,
    recategorized_by VARCHAR(36) NULL DEFAULT NULL,
    recategorization_reason TEXT NULL DEFAULT NULL,
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
    current_step INT NOT NULL DEFAULT 1,
    eodb_tier VARCHAR(50) NULL,
    eodb_days INT DEFAULT 3,
    target_completion_date DATETIME NULL,
    location VARCHAR(255) NULL,
    office_room VARCHAR(100) NULL,
    is_archived TINYINT(1) NOT NULL DEFAULT 0,
    materials_logged TINYINT(1) NOT NULL DEFAULT 0,
    is_labor_only TINYINT(1) NOT NULL DEFAULT 0,
    materials_stage VARCHAR(20) NOT NULL DEFAULT 'none',
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approval_delayed_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recategorized_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tickets_status (status),
    INDEX idx_tickets_submitted_at (submitted_at),
    INDEX idx_tickets_archived (is_archived),
    INDEX idx_tickets_approval_delayed (is_approval_delayed),
    INDEX idx_tickets_investigating (unit_id, is_under_investigation, is_archived)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. UNIT-SPECIFIC REQUEST DETAILS

-- FGMU Specific Details
CREATE TABLE IF NOT EXISTS fgmu_ticket_details (
    ticket_id VARCHAR(60) PRIMARY KEY,
    college_building VARCHAR(255) NOT NULL,
    office_room VARCHAR(100) NOT NULL,
    source_of_fund VARCHAR(150) NULL,
    jr_no VARCHAR(60) NULL,
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

-- SSU Incident Report Details
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

-- Lookup: SSU Incident Types
CREATE TABLE IF NOT EXISTS ssu_incident_types (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge: Ticket → Incident Types
CREATE TABLE IF NOT EXISTS ssu_incident_type_items (
    ticket_id VARCHAR(60) NOT NULL,
    incident_type_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (ticket_id, incident_type_id),
    CONSTRAINT fk_incident_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_incident_item_type FOREIGN KEY (incident_type_id) REFERENCES ssu_incident_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup: SSU Incident Issues
CREATE TABLE IF NOT EXISTS ssu_incident_issues (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    issue_name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge: Ticket → Incident Issues
CREATE TABLE IF NOT EXISTS ssu_incident_issue_items (
    ticket_id VARCHAR(60) NOT NULL,
    issue_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (ticket_id, issue_id),
    CONSTRAINT fk_issue_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_issue_item_issue FOREIGN KEY (issue_id) REFERENCES ssu_incident_issues(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup: SSU Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_roles (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge: Ticket → Reporter Roles
CREATE TABLE IF NOT EXISTS ssu_incident_role_items (
    ticket_id VARCHAR(60) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (ticket_id, role_id),
    CONSTRAINT fk_role_item_ticket FOREIGN KEY (ticket_id) REFERENCES ssu_incident_details(ticket_id) ON DELETE CASCADE,
    CONSTRAINT fk_role_item_role FOREIGN KEY (role_id) REFERENCES ssu_incident_roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. DISPATCHING, ASSIGNMENTS & MATERIALS

-- Inter-Unit Ticket Collaborations
CREATE TABLE IF NOT EXISTS ticket_collaborations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    requesting_unit_id INT UNSIGNED NOT NULL,
    collaborating_unit_id INT UNSIGNED NOT NULL,
    requested_by VARCHAR(36) NULL,
    reason TEXT NOT NULL,
    scope_of_work TEXT NULL,
    status ENUM('pending', 'accepted', 'declined', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    response_notes TEXT NULL,
    responded_by VARCHAR(36) NULL,
    responded_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_collab_ticket (ticket_id),
    INDEX idx_collab_collab_unit (collaborating_unit_id, status),
    INDEX idx_collab_req_unit (requesting_unit_id, status),
    CONSTRAINT fk_collab_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_req_unit FOREIGN KEY (requesting_unit_id) REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_collab_unit FOREIGN KEY (collaborating_unit_id) REFERENCES units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inter-Unit Ticket Collaborations
CREATE TABLE IF NOT EXISTS ticket_collaborations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    requesting_unit_id INT UNSIGNED NOT NULL,
    collaborating_unit_id INT UNSIGNED NOT NULL,
    requested_by VARCHAR(36) NULL,
    reason TEXT NOT NULL,
    scope_of_work TEXT NULL,
    status ENUM('pending', 'accepted', 'declined', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    response_notes TEXT NULL,
    responded_by VARCHAR(36) NULL,
    responded_at DATETIME NULL,
    completed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_collab_ticket (ticket_id),
    INDEX idx_collab_collab_unit (collaborating_unit_id, status),
    INDEX idx_collab_req_unit (requesting_unit_id, status),
    CONSTRAINT fk_collab_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_req_unit FOREIGN KEY (requesting_unit_id) REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_collab_unit FOREIGN KEY (collaborating_unit_id) REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_collab_requested_by FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_collab_responded_by FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ticket Assignments
CREATE TABLE IF NOT EXISTS ticket_assignments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    personnel_id VARCHAR(36) NOT NULL,
    implementation_date VARCHAR(100) NULL,
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
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dispatched_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    INDEX idx_assignments_ticket (ticket_id),
    INDEX idx_assignments_personnel (personnel_id),
    INDEX idx_assignments_reassigned_from (reassigned_from_id),
    CONSTRAINT fk_assignment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_personnel FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_reassigned_from FOREIGN KEY (reassigned_from_id) REFERENCES personnel(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Materials Used
CREATE TABLE IF NOT EXISTS ticket_materials (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NULL DEFAULT NULL,
    assignment_id INT UNSIGNED NULL DEFAULT NULL,
    material_name VARCHAR(200) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_measurement VARCHAR(50) NULL,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stage VARCHAR(20) NOT NULL DEFAULT 'assessment',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_materials_ticket (ticket_id),
    INDEX idx_materials_assignment (assignment_id),
    CONSTRAINT fk_materials_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_materials_assignment FOREIGN KEY (assignment_id) REFERENCES ticket_assignments(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PERFORMANCE EVALUATION & FEEDBACK

-- Unified Ticket Feedbacks
CREATE TABLE IF NOT EXISTS ticket_feedbacks (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    completion_status ENUM('early', 'on-time', 'beyond-time', 'not-completed') NOT NULL,
    courtesy_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    quality_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    efficiency_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    timeliness_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    cleanliness_rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
    remarks TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_feedbacks_user (user_id),
    CONSTRAINT fk_feedback_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lookup: Feedback Delay Reasons
CREATE TABLE IF NOT EXISTS feedback_delay_reasons (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    reason_code VARCHAR(60) NOT NULL UNIQUE,
    reason_label VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bridge: Feedback → Delay Reasons
CREATE TABLE IF NOT EXISTS ticket_feedback_delay_items (
    feedback_id INT UNSIGNED NOT NULL,
    delay_reason_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (feedback_id, delay_reason_id),
    CONSTRAINT fk_delay_item_feedback FOREIGN KEY (feedback_id) REFERENCES ticket_feedbacks(id) ON DELETE CASCADE,
    CONSTRAINT fk_delay_item_reason FOREIGN KEY (delay_reason_id) REFERENCES feedback_delay_reasons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ATTACHMENTS & AUDIT TRAILS

-- Ticket Attachments
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NULL,
    file_size_bytes BIGINT UNSIGNED NULL,
    is_encrypted TINYINT(1) NOT NULL DEFAULT 0,
    encryption_iv VARCHAR(64) NULL DEFAULT NULL,
    encryption_tag VARCHAR(64) NULL DEFAULT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attachments_ticket (ticket_id),
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- A. Business Process Audit Trail (Ticket lifecycle operations)
CREATE TABLE IF NOT EXISTS ticket_logs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL,
    user_id VARCHAR(36) NULL,
    action VARCHAR(150) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_logs_ticket (ticket_id),
    INDEX idx_logs_created (created_at),
    CONSTRAINT fk_logs_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- B. Account Activities Audit Trail (Security & Authentication events, RA 10173 compliant)
CREATE TABLE IF NOT EXISTS account_activity_logs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id VARCHAR(36) NULL,
    target_user_id VARCHAR(36) NULL,
    event_type VARCHAR(80) NOT NULL,
    severity ENUM('INFO', 'NOTICE', 'WARNING', 'CRITICAL') NOT NULL DEFAULT 'INFO',
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    device_summary VARCHAR(150) NULL,
    details TEXT NULL,
    metadata LONGTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_act_logs_actor (actor_id),
    INDEX idx_act_logs_target (target_user_id),
    INDEX idx_act_logs_event (event_type),
    INDEX idx_act_logs_severity (severity),
    INDEX idx_act_logs_created (created_at),
    CONSTRAINT fk_act_logs_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_act_logs_target FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BORROWING SYSTEM (LEAU: Borrowing of Plants / Tools & Equipment)

-- Inventory Items (pre-defined office inventory managed by LEAU Admin)
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    unit_id INT UNSIGNED NOT NULL DEFAULT 2,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NULL,
    category ENUM('tools', 'equipment', 'plants', 'materials', 'others') NOT NULL DEFAULT 'tools',
    serial_number VARCHAR(150) NULL,
    quantity_total INT UNSIGNED NOT NULL DEFAULT 1,
    quantity_available INT UNSIGNED NOT NULL DEFAULT 1,
    condition_status ENUM('excellent', 'good', 'fair', 'needs_repair', 'retired') NOT NULL DEFAULT 'good',
    location VARCHAR(255) NULL COMMENT 'Storage location within LEAU',
    description TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inventory_unit (unit_id),
    INDEX idx_inventory_category (category),
    INDEX idx_inventory_available (quantity_available),
    CONSTRAINT fk_inventory_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Borrowing Requests (one row per borrowing ticket)
CREATE TABLE IF NOT EXISTS borrowing_requests (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(60) NOT NULL UNIQUE,
    borrower_name VARCHAR(255) NOT NULL,
    borrower_id_number VARCHAR(50) NOT NULL,
    borrower_type ENUM('student', 'faculty', 'staff') NOT NULL,
    department_major VARCHAR(150) NULL,
    borrower_email VARCHAR(255) NOT NULL,
    borrower_contact VARCHAR(30) NOT NULL,
    item_name_requested VARCHAR(255) NOT NULL,
    item_model_requested VARCHAR(255) NULL,
    quantity_needed INT UNSIGNED NOT NULL DEFAULT 1,
    purpose_project TEXT NOT NULL,
    date_needed DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    terms_agreed TINYINT(1) NOT NULL DEFAULT 0,
    terms_agreed_at DATETIME NULL,
    status ENUM('pending_director', 'approved_director', 'inventory_assigned', 'ready_for_pickup', 'picked_up', 'overdue', 'returned', 'cancelled') NOT NULL DEFAULT 'pending_director',
    assigned_inventory_id INT UNSIGNED NULL,
    assigned_quantity INT UNSIGNED NULL,
    picked_up_at DATETIME NULL,
    picked_up_by VARCHAR(36) NULL,
    returned_at DATETIME NULL,
    returned_by VARCHAR(36) NULL,
    return_condition ENUM('excellent', 'good', 'fair', 'damaged', 'lost') NULL,
    return_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_borrowing_status (status),
    INDEX idx_borrowing_dates (date_needed, expected_return_date),
    INDEX idx_borrowing_inventory (assigned_inventory_id),
    CONSTRAINT fk_borrowing_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_borrowing_inventory FOREIGN KEY (assigned_inventory_id) REFERENCES inventory_items(id) ON DELETE SET NULL,
    CONSTRAINT fk_borrowing_picked_by FOREIGN KEY (picked_up_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_borrowing_returned_by FOREIGN KEY (returned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Borrowing Attachments (usage photos, event/project documents)
CREATE TABLE IF NOT EXISTS borrowing_attachments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrowing_request_id INT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(100) NULL,
    file_size_bytes BIGINT UNSIGNED NULL,
    attachment_type ENUM('usage_photos', 'event_documents', 'project_docs', 'others') NOT NULL DEFAULT 'others',
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_borrowing_attach_request (borrowing_request_id),
    CONSTRAINT fk_borrowing_attach_request FOREIGN KEY (borrowing_request_id) REFERENCES borrowing_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Borrowing History (status transition audit trail)
CREATE TABLE IF NOT EXISTS borrowing_history (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    borrowing_request_id INT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL COMMENT 'created, director_approved, inventory_assigned, ready_for_pickup, picked_up, overdue, returned, cancelled',
    performed_by VARCHAR(36) NULL,
    details TEXT NULL,
    previous_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_history_request (borrowing_request_id),
    INDEX idx_history_action (action),
    INDEX idx_history_performed_by (performed_by),
    CONSTRAINT fk_history_request FOREIGN KEY (borrowing_request_id) REFERENCES borrowing_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_performed_by FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. SYSTEM, SECURITY & SESSIONS

-- Single Active User Sessions Table
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

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NULL,
    updated_at DATETIME NULL,
    INDEX idx_notifications_user (user_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OTP Codes
CREATE TABLE IF NOT EXISTS otp_codes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_data TEXT NULL,
    INDEX idx_otp_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Account Activity Logs (Security & Authentication events, RA 10173 compliant)
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

-- System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    `key` VARCHAR(100) NOT NULL PRIMARY KEY,
    value TEXT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO system_settings (`key`, value, description) VALUES
('resend_api_key', NULL, 'API Key from Resend.com for transactional email delivery'),
('resend_from_email', 'GSO E-Ticketing <onboarding@resend.dev>', 'Sender email address for outgoing system emails'),
('resend_notifications_enabled', '1', 'Global toggle for email notification dispatch (1 = active, 0 = paused)'),
('google_drive_folder_id', NULL, 'Target Google Drive folder ID for cloud database backups'),
('google_drive_credentials_json', NULL, 'Google Cloud Service Account JSON credentials');

-- Password Resets
CREATE TABLE IF NOT EXISTS password_resets (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(128) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_resets_email (email),
    INDEX idx_password_resets_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System Backups (Dual-Vault: Onsite Local + Google Drive Cloud Storage)
CREATE TABLE IF NOT EXISTS system_backups (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    backup_type ENUM('manual', 'scheduled') NOT NULL DEFAULT 'manual',
    tables_included TEXT NULL,
    google_drive_file_id VARCHAR(255) NULL,
    google_drive_link TEXT NULL,
    google_drive_status ENUM('not_configured', 'pending', 'uploaded', 'failed') NOT NULL DEFAULT 'not_configured',
    google_drive_error TEXT NULL,
    status ENUM('completed', 'in_progress', 'failed') NOT NULL DEFAULT 'completed',
    notes VARCHAR(255) NULL,
    created_by VARCHAR(36) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_backups_created (created_at),
    INDEX idx_backups_status (status),
    INDEX fk_backups_user (created_by),
    CONSTRAINT fk_backups_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. INITIAL REFERENCE SEEDS

INSERT IGNORE INTO units (id, code, name, description) VALUES
(1, 'FGMU', 'Facilities and Grounds Management Unit', 'Manages structure, finishes, utilities, mechanical, electrical, and carpentry repairs across campus.'),
(2, 'LEAU', 'Landscape and Environment Aesthetics Unit', 'Responsible for campus landscaping, grounds maintenance, janitorial operations, and environmental disinfection.'),
(3, 'SSU', 'Security Service Unit', 'Coordinates campus security personnel, incident response, investigation, and physical campus safety.');

INSERT IGNORE INTO ssu_incident_types (id, type_name) VALUES
(1, 'Theft / Robbery'), (2, 'Vandalism / Property Damage'), (3, 'Physical Assault / Altercation'),
(4, 'Trespassing / Unauthorized Entry'), (5, 'Road Accident / Vehicular Collision'),
(6, 'Medical Emergency / Injury'), (7, 'Fire / Hazard Alert'), (8, 'Other Security Concern');

INSERT IGNORE INTO ssu_incident_issues (id, issue_name) VALUES
(1, 'Lost / Stolen Personal Belongings'), (2, 'Damaged University Facilities / Equipment'),
(3, 'Safety Policy Violation'), (4, 'Traffic Regulation Violation'), (5, 'Suspicious Activity Observed');

INSERT IGNORE INTO ssu_incident_roles (id, role_name) VALUES
(1, 'Victim / Complainant'), (2, 'Eyewitness'), (3, 'Security Officer on Duty'), (4, 'Responding Personnel');

INSERT IGNORE INTO feedback_delay_reasons (id, reason_code, reason_label) VALUES
(1, 'personnelAbsent', 'Assigned personnel was absent or unavailable'),
(2, 'extendedBreak', 'Personnel took extended breaks during the repair/task'),
(3, 'additionalWork', 'Unexpected additional work or complications arose'),
(4, 'lackDays', 'Insufficient number of days allotted for the job scope'),
(5, 'lackMaterials', 'Delay due to lack of replacement parts or materials'),
(6, 'lackSkills', 'Required specialized tools or external expertise');

SET FOREIGN_KEY_CHECKS = 1;
