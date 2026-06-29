USE master;
GO

IF DB_ID('lmsmaster') IS NOT NULL
BEGIN
    ALTER DATABASE lmsmaster SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE lmsmaster;
END
GO

CREATE DATABASE lmsmaster;
GO

USE lmsmaster;
GO

-- Create schema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'role')
BEGIN
    EXEC('CREATE SCHEMA [role]');
END
GO

-- ==========================================
-- Table 1: mst_role
-- ==========================================
CREATE TABLE role.mst_role (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_code VARCHAR(10) NOT NULL UNIQUE,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50)
);

-- Seed mst_role
INSERT INTO role.mst_role (role_code, role_name, created_by) VALUES 
('ADM', 'Admin', 'SYSTEM'),
('RM', 'Reporting Manager', 'SYSTEM'),
('EMP', 'Employee', 'SYSTEM');

-- ==========================================
-- Table 2: mst_department
-- ==========================================
CREATE TABLE role.mst_department (
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    department_code VARCHAR(10) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL,
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50)
);

-- Seed mst_department
INSERT INTO role.mst_department (department_code, department_name, created_by) VALUES 
('IT', 'Information Technology', 'SYSTEM'),
('HR', 'Human Resources', 'SYSTEM'),
('FIN', 'Finance', 'SYSTEM'),
('LND', 'Learning and Development', 'SYSTEM'),
('ADMN', 'Administration', 'SYSTEM');

-- ==========================================
-- Table 3: mst_designation
-- ==========================================
CREATE TABLE role.mst_designation (
    designation_id INT IDENTITY(1,1) PRIMARY KEY,
    designation_code VARCHAR(10) NOT NULL UNIQUE,
    designation_name VARCHAR(100) NOT NULL,
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50)
);

-- Seed mst_designation
INSERT INTO role.mst_designation (designation_code, designation_name, created_by) VALUES 
('CEO', 'Chief Executive Officer', 'SYSTEM'),
('CTO', 'Chief Technology Officer', 'SYSTEM'),
('VP', 'Vice President', 'SYSTEM'),
('DIR', 'Director', 'SYSTEM'),
('MGR', 'Manager', 'SYSTEM'),
('TL', 'Team Lead', 'SYSTEM'),
('SSE', 'Senior Software Engineer', 'SYSTEM'),
('SE', 'Software Engineer', 'SYSTEM'),
('JSE', 'Junior Software Engineer', 'SYSTEM'),
('HRBP', 'HR Business Partner', 'SYSTEM');

-- ==========================================
-- Table 4: mst_employee
-- ==========================================
CREATE TABLE role.mst_employee (
    emp_id VARCHAR(10) PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) NOT NULL,
    designation_code VARCHAR(10) NOT NULL,
    reporting_manager_id VARCHAR(10),
    official_email_encrypted VARCHAR(500) NOT NULL,
    mobile_no_encrypted VARCHAR(500),
    profile_photo_url VARCHAR(500),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    dob DATE,
    joining_date DATE,
    employee_status VARCHAR(20) DEFAULT 'Active',
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50),
    CONSTRAINT fk_emp_dept FOREIGN KEY (department_code) REFERENCES role.mst_department(department_code),
    CONSTRAINT fk_emp_desg FOREIGN KEY (designation_code) REFERENCES role.mst_designation(designation_code),
    CONSTRAINT fk_emp_mgr FOREIGN KEY (reporting_manager_id) REFERENCES role.mst_employee(emp_id)
);

-- ==========================================
-- Table 5: mst_user_login
-- ==========================================
CREATE TABLE role.mst_user_login (
    login_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    failed_login_attempts INT DEFAULT 0,
    is_locked CHAR(1) DEFAULT 'N' CHECK (is_locked IN ('Y', 'N')),
    lock_time DATETIME,
    unlock_time DATETIME,
    last_login DATETIME,
    last_logout DATETIME,
    password_changed_date DATETIME,
    password_expiry_date DATETIME,
    is_first_login CHAR(1) DEFAULT 'Y' CHECK (is_first_login IN ('Y', 'N')),
    force_password_change CHAR(1) DEFAULT 'N' CHECK (force_password_change IN ('Y', 'N')),
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50),
    CONSTRAINT fk_login_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id)
);

-- ==========================================
-- Table 6: mst_employee_role
-- ==========================================
CREATE TABLE role.mst_employee_role (
    employee_role_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL,
    role_id INT NOT NULL,
    is_default_role CHAR(1) DEFAULT 'N' CHECK (is_default_role IN ('Y', 'N')),
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    created_date DATETIME DEFAULT GETDATE(),
    created_by VARCHAR(10),
    updated_date DATETIME,
    updated_by VARCHAR(10),
    ip_address VARCHAR(50),
    CONSTRAINT fk_emprole_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id),
    CONSTRAINT fk_emprole_role FOREIGN KEY (role_id) REFERENCES role.mst_role(role_id),
    CONSTRAINT uq_emprole UNIQUE (emp_id, role_id)
);

-- ==========================================
-- Table 7: mst_password_history
-- ==========================================
CREATE TABLE role.mst_password_history (
    history_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    changed_on DATETIME DEFAULT GETDATE(),
    changed_by VARCHAR(10),
    ip_address VARCHAR(50),
    CONSTRAINT fk_pwdhist_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id)
);

-- ==========================================
-- Table 8: trn_login_history
-- ==========================================
CREATE TABLE role.trn_login_history (
    login_history_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL,
    login_time DATETIME NOT NULL,
    logout_time DATETIME,
    login_status VARCHAR(20) NOT NULL,
    failure_reason VARCHAR(255),
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    device_name VARCHAR(100),
    ip_address VARCHAR(50),
    CONSTRAINT fk_loginhist_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id)
);


-- ==========================================
-- Table 10: trn_user_session
-- ==========================================
CREATE TABLE role.trn_user_session (
    session_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL,
    jwt_token VARCHAR(MAX) NOT NULL,
    refresh_token VARCHAR(255),
    login_time DATETIME NOT NULL,
    expiry_time DATETIME NOT NULL,
    browser VARCHAR(100),
    operating_system VARCHAR(100),
    device_name VARCHAR(100),
    ip_address VARCHAR(50),
    is_active CHAR(1) DEFAULT 'Y' CHECK (is_active IN ('Y', 'N')),
    CONSTRAINT fk_usersession_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id)
);


-- ==========================================
-- Table 10: trn_otp (Consolidated)
-- ==========================================
CREATE TABLE role.trn_otp (
    otp_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    emp_id VARCHAR(10) NOT NULL,
    token VARCHAR(255),
    otp VARCHAR(10),
    purpose VARCHAR(50) NOT NULL,
    generated_time DATETIME DEFAULT GETDATE(),
    expiry_time DATETIME NOT NULL,
    verified CHAR(1) DEFAULT 'N' CHECK (verified IN ('Y', 'N')),
    verified_time DATETIME,
    ip_address VARCHAR(50),
    CONSTRAINT fk_otp_emp FOREIGN KEY (emp_id) REFERENCES role.mst_employee(emp_id)
);

-- ==========================================
-- Indexes for performance
-- ==========================================
CREATE INDEX ix_emp_email ON role.mst_employee(official_email_encrypted);
CREATE INDEX ix_emp_mobile ON role.mst_employee(mobile_no_encrypted);
CREATE INDEX ix_userlogin_emp ON role.mst_user_login(emp_id);
CREATE INDEX ix_loginhist_emp ON role.trn_login_history(emp_id);
CREATE INDEX ix_session_token ON role.trn_user_session(refresh_token);
CREATE INDEX ix_otp_token ON role.trn_otp(token);
