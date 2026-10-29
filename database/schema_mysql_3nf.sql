-- ============================================================================
-- GSO Integrated Services Operations and E-Ticketing System
-- Pure Database Definition Language (DDL) Schema (Third Normal Form - 3NF)
-- Target RDBMS: MySQL 8.0+ / MariaDB 10.4+
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

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+08:00";

-- ----------------------------------------------------------------------------
-- 1. CORE ORGANIZATIONAL & USER ENTITIES
-- ----------------------------------------------------------------------------

-- Table 1: Operating Units (FGMU, LEAU, SSU)
CREATE TABLE IF NOT EXISTS `units` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_units_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: User Accounts (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `name_extension` varchar(20) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` text NOT NULL,
  `contact_number` varchar(30) DEFAULT NULL,
  `role` enum('student','employee','admin','staff','director','superadmin','worker') NOT NULL DEFAULT 'student',
  `unit_id` int(11) UNSIGNED DEFAULT NULL,
  `student_id_number` varchar(50) DEFAULT NULL,
  `student_type` varchar(50) DEFAULT NULL,
  `employee_type` varchar(100) DEFAULT NULL,
  `organization_name` varchar(150) DEFAULT NULL,
  `college` varchar(150) DEFAULT NULL,
  `id_card_image` text DEFAULT NULL,
  `id_selfie_image` text DEFAULT NULL,
  `avatar_path` varchar(255) DEFAULT NULL,
  `signature_path` varchar(255) DEFAULT NULL,
  `status` enum('Active','Pending','Rejected','Suspended','Archived') NOT NULL DEFAULT 'Active',
  `is_verified` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  `email_notifications_enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Per-account opt-in for email notifications',
  `is_mfa_enabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Two-factor authentication via email OTP',
  `failed_login_attempts` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `lockout_until` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_unit` (`unit_id`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_last_login` (`last_login_at`),
  CONSTRAINT `fk_users_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: Field & Technical Personnel
CREATE TABLE IF NOT EXISTS `personnel` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `unit_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `specialty` varchar(100) NOT NULL,
  `status` enum('available','working','on_leave') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_personnel_unit` (`unit_id`),
  KEY `idx_personnel_status` (`status`),
  KEY `idx_personnel_user` (`user_id`),
  CONSTRAINT `fk_personnel_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_personnel_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 4: Personnel Categories (Specialty Classifications)
CREATE TABLE IF NOT EXISTS `personnel_categories` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `unit_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `supported_services` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_categories_unit` (`unit_id`),
  CONSTRAINT `fk_categories_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. CORE TICKETING SUBSYSTEM (TABLE INHERITANCE PATTERN)
-- ----------------------------------------------------------------------------

-- Table 5: Base Tickets Table
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` varchar(60) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `unit_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `service_type` varchar(150) NOT NULL,
  `is_recategorized` tinyint(1) NOT NULL DEFAULT 0,
  `original_service_type` varchar(150) DEFAULT NULL,
  `recategorized_at` datetime DEFAULT NULL,
  `recategorized_by` varchar(36) DEFAULT NULL,
  `recategorization_reason` text DEFAULT NULL,
  `description` text NOT NULL,
  `status` enum('pending','approved','processing','resolved','closed','declined','cancelled') NOT NULL DEFAULT 'pending',
  `status_label` varchar(100) NOT NULL DEFAULT 'Pending Approval',
  `is_emergency` tinyint(1) NOT NULL DEFAULT 0,
  `is_approval_delayed` tinyint(1) NOT NULL DEFAULT 0,
  `approval_delay_reason` text DEFAULT NULL,
  `approval_delayed_at` datetime DEFAULT NULL,
  `approval_delayed_by` varchar(36) DEFAULT NULL,
  `is_escalated_to_director` tinyint(1) NOT NULL DEFAULT 0,
  `escalation_reason` text DEFAULT NULL,
  `escalated_at` datetime DEFAULT NULL,
  `escalated_by` varchar(36) DEFAULT NULL,
  `verification_status` enum('pending_report','pending_verification','verified_closed') NOT NULL DEFAULT 'pending_report',
  `accomplishment_report_path` varchar(255) DEFAULT NULL,
  `accomplishment_notes` text DEFAULT NULL,
  `verified_by_user_id` varchar(36) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `decline_reason` text DEFAULT NULL,
  `current_step` int(1) NOT NULL DEFAULT 1,
  `eodb_tier` varchar(50) DEFAULT NULL,
  `eodb_days` int(11) DEFAULT 3,
  `target_completion_date` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `office_room` varchar(100) DEFAULT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `materials_logged` tinyint(1) NOT NULL DEFAULT 0,
  `is_labor_only` tinyint(1) NOT NULL DEFAULT 0,
  `materials_stage` varchar(20) NOT NULL DEFAULT 'none',
  `is_under_investigation` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'SSU only: active investigation flag',
  `ssu_notation` text DEFAULT NULL COMMENT 'SSU staff recommendation notation',
  `staff_notation` text DEFAULT NULL COMMENT 'Staff notation/update communicated to requester',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewed_by` varchar(36) DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_project` tinyint(1) NOT NULL DEFAULT 0,
  `project_title` varchar(255) DEFAULT NULL,
  `project_target_duration` varchar(100) DEFAULT NULL,
  `project_target_date` date DEFAULT NULL,
  `project_manpower` varchar(255) DEFAULT NULL,
  `project_remarks` text DEFAULT NULL,
  `project_actual_start` date DEFAULT NULL,
  `project_actual_completion` date DEFAULT NULL,
  `project_working_days` int(11) DEFAULT NULL,
  `extension_days` int(11) NOT NULL DEFAULT 0,
  `extended_completion_date` date DEFAULT NULL,
  `extension_reason` text DEFAULT NULL,
  `overtime_hours` decimal(6,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `idx_tickets_user` (`user_id`),
  KEY `idx_tickets_unit_status` (`unit_id`,`status`),
  KEY `idx_tickets_archived` (`is_archived`),
  KEY `idx_tickets_approval_delayed` (`is_approval_delayed`),
  KEY `idx_tickets_escalated` (`is_escalated_to_director`),
  KEY `idx_tickets_submitted` (`submitted_at`),
  KEY `idx_tickets_verification_status` (`verification_status`),
  CONSTRAINT `fk_tickets_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_tickets_verified_by` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 6: Ticket File Attachments (Encrypted Uploads)
CREATE TABLE IF NOT EXISTS `ticket_attachments` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `is_encrypted` tinyint(1) NOT NULL DEFAULT 0,
  `encryption_iv` varchar(64) DEFAULT NULL,
  `encryption_tag` varchar(64) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_attachments_ticket` (`ticket_id`),
  CONSTRAINT `fk_attachments_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: FGMU Ticket Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS `fgmu_ticket_details` (
  `ticket_id` varchar(60) NOT NULL,
  `college_building` varchar(255) DEFAULT NULL,
  `office_room` varchar(100) DEFAULT NULL,
  `source_of_fund` varchar(150) DEFAULT NULL,
  `jr_no` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  CONSTRAINT `fk_fgmu_details_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 8: LEAU Ticket Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS `leau_ticket_details` (
  `ticket_id` varchar(60) NOT NULL,
  `college_building` varchar(255) DEFAULT NULL,
  `office_room` varchar(100) DEFAULT NULL,
  `source_of_fund` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  CONSTRAINT `fk_leau_details_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 9: SSU Incident Details (1:1 Extension Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_details` (
  `ticket_id` varchar(60) NOT NULL,
  `where_occurred` text DEFAULT NULL,
  `when_occurred` varchar(150) DEFAULT NULL,
  `how_narrative` text DEFAULT NULL,
  `reporter_name` varchar(255) DEFAULT NULL,
  `reporter_signature` longtext DEFAULT NULL,
  `other_incident` text DEFAULT NULL,
  `other_information` text DEFAULT NULL,
  `follow_up` tinyint(1) NOT NULL DEFAULT 0,
  `who_involved` text DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  CONSTRAINT `fk_ssu_details_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. 1NF NORMALIZED LOOKUP & BRIDGE ENTITIES
-- ----------------------------------------------------------------------------

-- Table 10: SSU Incident Types (Lookup Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_types` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 11: SSU Incident Type Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_type_items` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `type_id` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ssu_type_items_ticket` (`ticket_id`),
  KEY `idx_ssu_type_items_type` (`type_id`),
  CONSTRAINT `fk_ssu_type_items_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ssu_type_items_type` FOREIGN KEY (`type_id`) REFERENCES `ssu_incident_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 12: SSU Incident Issues (Lookup Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_issues` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `issue_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 13: SSU Incident Issue Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_issue_items` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `issue_id` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ssu_issue_items_ticket` (`ticket_id`),
  KEY `idx_ssu_issue_items_issue` (`issue_id`),
  CONSTRAINT `fk_ssu_issue_items_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ssu_issue_items_issue` FOREIGN KEY (`issue_id`) REFERENCES `ssu_incident_issues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 14: SSU Incident Roles (Lookup Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_roles` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 15: SSU Incident Role Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS `ssu_incident_role_items` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `role_id` int(11) UNSIGNED NOT NULL,
  `person_name` varchar(255) NOT NULL,
  `contact_details` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ssu_role_items_ticket` (`ticket_id`),
  KEY `idx_ssu_role_items_role` (`role_id`),
  CONSTRAINT `fk_ssu_role_items_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ssu_role_items_role` FOREIGN KEY (`role_id`) REFERENCES `ssu_incident_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. OPERATIONS, ASSIGNMENTS & MASTER CATALOG
-- ----------------------------------------------------------------------------

-- Table 16: Inter-Unit Ticket Collaborations
CREATE TABLE IF NOT EXISTS `ticket_collaborations` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `collaborating_unit_id` int(11) UNSIGNED NOT NULL,
  `status` enum('pending','accepted','declined','completed') NOT NULL DEFAULT 'pending',
  `reason` text NOT NULL,
  `response_notes` text DEFAULT NULL,
  `service_type` varchar(150) DEFAULT NULL,
  `requested_by` varchar(36) NOT NULL,
  `responded_by` varchar(36) DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `responded_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_collab_ticket` (`ticket_id`),
  KEY `idx_collab_unit` (`collaborating_unit_id`),
  KEY `idx_collab_requested_by` (`requested_by`),
  KEY `idx_collab_responded_by` (`responded_by`),
  CONSTRAINT `fk_collab_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_unit` FOREIGN KEY (`collaborating_unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_responded_by` FOREIGN KEY (`responded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 17: Ticket Personnel Assignments
CREATE TABLE IF NOT EXISTS `ticket_assignments` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `personnel_id` varchar(36) NOT NULL,
  `assigned_by` varchar(36) NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL,
  `status` enum('assigned','in_progress','completed') NOT NULL DEFAULT 'assigned',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_assignments_ticket` (`ticket_id`),
  KEY `idx_assignments_personnel` (`personnel_id`),
  KEY `idx_assignments_assigned_by` (`assigned_by`),
  CONSTRAINT `fk_assignments_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignments_personnel` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignments_assigned_by` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 18: Ticket Materials Log
CREATE TABLE IF NOT EXISTS `ticket_materials` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `unit` varchar(50) NOT NULL DEFAULT 'pcs',
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `stage` varchar(20) NOT NULL DEFAULT 'assessment',
  `logged_by` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_materials_ticket` (`ticket_id`),
  KEY `idx_materials_logged_by` (`logged_by`),
  CONSTRAINT `fk_materials_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_materials_logged_by` FOREIGN KEY (`logged_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 19: Master Catalog Materials (Unit Standard Items)
CREATE TABLE IF NOT EXISTS `catalog_materials` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `unit_code` enum('FGMU','LEAU') NOT NULL,
  `category` varchar(60) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `default_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_catalog_materials_unit` (`unit_code`,`is_active`),
  KEY `idx_catalog_materials_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 20: Institutional Work Calendar & Special Non-Working Holidays
CREATE TABLE IF NOT EXISTS `special_holidays` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `holiday_date` date NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'special_non_working',
  `is_recurring` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_special_holidays_date` (`holiday_date`, `is_active`),
  KEY `idx_special_holidays_recurring` (`is_recurring`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. QUALITY ASSURANCE, FEEDBACK & DELAYS
-- ----------------------------------------------------------------------------

-- Table 21: Ticket Customer Feedbacks
CREATE TABLE IF NOT EXISTS `ticket_feedbacks` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `client_id` varchar(36) NOT NULL,
  `overall_rating` int(1) NOT NULL,
  `quality_rating` int(1) DEFAULT NULL,
  `timeliness_rating` int(1) DEFAULT NULL,
  `professionalism_rating` int(1) DEFAULT NULL,
  `comments` text DEFAULT NULL,
  `completion_status` enum('early','on-time','beyond-time','not-completed') NOT NULL DEFAULT 'on-time',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_feedbacks_ticket` (`ticket_id`),
  KEY `idx_feedbacks_client` (`client_id`),
  CONSTRAINT `fk_feedbacks_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedbacks_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 22: Feedback Delay Reasons (Lookup Table)
CREATE TABLE IF NOT EXISTS `feedback_delay_reasons` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `reason_code` varchar(60) NOT NULL,
  `reason_label` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_delay_reason_code` (`reason_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 23: Ticket Feedback Delay Items (1NF Bridge Table)
CREATE TABLE IF NOT EXISTS `ticket_feedback_delay_items` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `feedback_id` int(11) UNSIGNED NOT NULL,
  `delay_reason_id` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_delay_items_feedback` (`feedback_id`),
  KEY `idx_delay_items_reason` (`delay_reason_id`),
  CONSTRAINT `fk_delay_items_feedback` FOREIGN KEY (`feedback_id`) REFERENCES `ticket_feedbacks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_delay_items_reason` FOREIGN KEY (`delay_reason_id`) REFERENCES `feedback_delay_reasons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. BORROWING & INVENTORY MANAGEMENT SUBSYSTEM
-- ----------------------------------------------------------------------------

-- Table 24: Equipment, Tools & Botanical Inventory
CREATE TABLE IF NOT EXISTS `inventory_items` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `unit_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `model` varchar(255) DEFAULT NULL,
  `category` enum('tools','equipment','plants','materials','others') NOT NULL DEFAULT 'tools',
  `serial_number` varchar(100) DEFAULT NULL,
  `quantity_total` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `quantity_available` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `condition_status` enum('excellent','good','fair','needs_repair','retired') NOT NULL DEFAULT 'good',
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_inventory_unit` (`unit_id`),
  KEY `idx_inventory_category` (`category`),
  KEY `idx_inventory_status` (`condition_status`),
  KEY `idx_inventory_active` (`is_active`),
  CONSTRAINT `fk_inventory_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inventory_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 25: Item Borrowing Requests (Normalized 3NF Extension)
CREATE TABLE IF NOT EXISTS `borrowing_requests` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `borrower_name` varchar(255) NOT NULL,
  `borrower_id_number` varchar(50) NOT NULL,
  `borrower_type` enum('student','faculty','staff') NOT NULL DEFAULT 'student',
  `department_major` varchar(150) DEFAULT NULL,
  `borrower_email` varchar(255) NOT NULL,
  `borrower_contact` varchar(30) NOT NULL,
  `item_name_requested` varchar(255) NOT NULL,
  `item_model_requested` varchar(255) DEFAULT NULL,
  `quantity_needed` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `purpose_project` text NOT NULL,
  `date_needed` date NOT NULL,
  `expected_return_date` date NOT NULL,
  `terms_agreed` tinyint(1) NOT NULL DEFAULT 1,
  `terms_agreed_at` datetime DEFAULT NULL,
  `status` enum('pending_director','approved_director','declined_director','inventory_assigned','ready_for_pickup','picked_up','returned','overdue','cancelled') NOT NULL DEFAULT 'pending_director',
  `assigned_inventory_id` int(11) UNSIGNED DEFAULT NULL,
  `assigned_quantity` int(11) UNSIGNED DEFAULT NULL,
  `picked_up_at` datetime DEFAULT NULL,
  `picked_up_by` varchar(36) DEFAULT NULL,
  `returned_at` datetime DEFAULT NULL,
  `returned_by` varchar(36) DEFAULT NULL,
  `return_condition` enum('excellent','good','fair','damaged','lost') DEFAULT NULL,
  `return_notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_borrowing_ticket` (`ticket_id`),
  KEY `idx_borrowing_status` (`status`),
  KEY `idx_borrowing_inventory` (`assigned_inventory_id`),
  KEY `idx_borrowing_date_needed` (`date_needed`),
  KEY `idx_borrowing_return_date` (`expected_return_date`),
  CONSTRAINT `fk_borrowing_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_borrowing_inventory` FOREIGN KEY (`assigned_inventory_id`) REFERENCES `inventory_items` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_borrowing_picked_up_by` FOREIGN KEY (`picked_up_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_borrowing_returned_by` FOREIGN KEY (`returned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 26: Borrowing Identification & Supporting Attachments
CREATE TABLE IF NOT EXISTS `borrowing_attachments` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `borrowing_request_id` int(11) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `attachment_type` enum('borrower_id','approval_letter','other') NOT NULL DEFAULT 'borrower_id',
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_borrowing_attachments_req` (`borrowing_request_id`),
  CONSTRAINT `fk_borrowing_attachments_req` FOREIGN KEY (`borrowing_request_id`) REFERENCES `borrowing_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 27: Borrowing Request Lifecycle Audit History
CREATE TABLE IF NOT EXISTS `borrowing_history` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `borrowing_request_id` int(11) UNSIGNED NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `action_by` varchar(36) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_borrowing_history_req` (`borrowing_request_id`),
  KEY `idx_borrowing_history_user` (`action_by`),
  CONSTRAINT `fk_borrowing_history_req` FOREIGN KEY (`borrowing_request_id`) REFERENCES `borrowing_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_borrowing_history_user` FOREIGN KEY (`action_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. AUDITING, SESSIONS & SECURITY SUBSYSTEM
-- ----------------------------------------------------------------------------

-- Table 28: Ticket Action Logs (Operational Audit Trail)
CREATE TABLE IF NOT EXISTS `ticket_logs` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(60) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `action` varchar(100) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_logs_ticket` (`ticket_id`),
  KEY `idx_logs_user` (`user_id`),
  CONSTRAINT `fk_logs_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 29: Account Activity Logs (Security & Compliance Trail)
CREATE TABLE IF NOT EXISTS `account_activity_logs` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_id` varchar(36) DEFAULT NULL,
  `target_user_id` varchar(36) DEFAULT NULL,
  `event_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_activity_actor` (`actor_id`),
  KEY `idx_activity_target` (`target_user_id`),
  KEY `idx_activity_event` (`event_type`),
  KEY `idx_activity_created` (`created_at`),
  CONSTRAINT `fk_activity_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_activity_target` FOREIGN KEY (`target_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 30: User Sessions (Single Active Session Enforcement)
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `session_id` varchar(64) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_sessions_user` (`user_id`),
  KEY `idx_user_sessions_sid` (`session_id`),
  CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 31: User MFA Email OTP Challenges
CREATE TABLE IF NOT EXISTS `user_mfa_challenges` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `temp_token` varchar(64) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_mfa_temp_token` (`temp_token`),
  KEY `idx_mfa_user_id` (`user_id`),
  KEY `idx_mfa_expires_at` (`expires_at`),
  CONSTRAINT `fk_mfa_challenges_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 32: In-App User Notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `related_entity_type` varchar(50) DEFAULT NULL,
  `related_entity_id` varchar(60) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user_read` (`user_id`,`is_read`),
  KEY `idx_notifications_created` (`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 33: One-Time Password (OTP) Verification Codes
CREATE TABLE IF NOT EXISTS `otp_codes` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `type` enum('registration','login','password_reset') NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `user_data` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_otp_email_type_code` (`email`,`type`,`code`),
  KEY `idx_otp_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 34: Global System Key-Value Settings
CREATE TABLE IF NOT EXISTS `system_settings` (
  `key` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 35: Password Reset Tokens
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(128) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_password_resets_email` (`email`),
  KEY `idx_password_resets_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 36: System Backups (Dual-Vault Registry: Local + Google Drive)
CREATE TABLE IF NOT EXISTS `system_backups` (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size_bytes` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `backup_type` enum('manual','scheduled') NOT NULL DEFAULT 'manual',
  `backup_category` enum('database','media','full') NOT NULL DEFAULT 'database',
  `tables_included` text DEFAULT NULL,
  `google_drive_file_id` varchar(255) DEFAULT NULL,
  `google_drive_link` text DEFAULT NULL,
  `google_drive_status` enum('not_configured','pending','uploaded','failed') NOT NULL DEFAULT 'not_configured',
  `google_drive_error` text DEFAULT NULL,
  `status` enum('completed','in_progress','failed') NOT NULL DEFAULT 'completed',
  `notes` varchar(255) DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_backups_created` (`created_at`),
  KEY `idx_backups_status` (`status`),
  KEY `idx_backups_category` (`backup_category`),
  KEY `fk_backups_user` (`created_by`),
  CONSTRAINT `fk_backups_user` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
