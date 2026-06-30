using System;
using System.Collections.Generic;
using LMSMaster.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LMSMaster.API.Data;

public partial class LMSMasterContext : DbContext
{
    public LMSMasterContext()
    {
    }

    public LMSMasterContext(DbContextOptions<LMSMasterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MstDepartment> MstDepartments { get; set; }

    public virtual DbSet<MstDesignation> MstDesignations { get; set; }

    public virtual DbSet<MstEmployee> MstEmployees { get; set; }

    public virtual DbSet<MstEmployeeRole> MstEmployeeRoles { get; set; }

    public virtual DbSet<MstPasswordHistory> MstPasswordHistories { get; set; }

    public virtual DbSet<MstRole> MstRoles { get; set; }

    public virtual DbSet<MstUserLogin> MstUserLogins { get; set; }

    public virtual DbSet<TrnLoginHistory> TrnLoginHistories { get; set; }

    public virtual DbSet<TrnOtp> TrnOtps { get; set; }

    public virtual DbSet<TrnUserSession> TrnUserSessions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=localhost;Database=lmsmaster;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MstDepartment>(entity =>
        {
            entity.HasKey(e => e.DepartmentId).HasName("PK__mst_depa__C2232422016A901D");

            entity.ToTable("mst_department", "role");

            entity.HasIndex(e => e.DepartmentCode, "UQ__mst_depa__EBC3495E2D440F36").IsUnique();

            entity.Property(e => e.DepartmentId).HasColumnName("department_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("department_code");
            entity.Property(e => e.DepartmentName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("department_name");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<MstDesignation>(entity =>
        {
            entity.HasKey(e => e.DesignationId).HasName("PK__mst_desi__177649C12D78FF6A");

            entity.ToTable("mst_designation", "role");

            entity.HasIndex(e => e.DesignationCode, "UQ__mst_desi__1E7339A74D8332B7").IsUnique();

            entity.Property(e => e.DesignationId).HasColumnName("designation_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DesignationCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("designation_code");
            entity.Property(e => e.DesignationName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("designation_name");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<MstEmployee>(entity =>
        {
            entity.HasKey(e => e.EmpId).HasName("PK__mst_empl__1299A8613D2FAAAB");

            entity.ToTable("mst_employee", "role");

            entity.HasIndex(e => e.OfficialEmailEncrypted, "ix_emp_email");

            entity.HasIndex(e => e.MobileNoEncrypted, "ix_emp_mobile");

            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.DepartmentCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("department_code");
            entity.Property(e => e.DesignationCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("designation_code");
            entity.Property(e => e.Dob).HasColumnName("dob");
            entity.Property(e => e.EmpName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("emp_name");
            entity.Property(e => e.EmployeeStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Active")
                .HasColumnName("employee_status");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("gender");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.JoiningDate).HasColumnName("joining_date");
            entity.Property(e => e.MobileNoEncrypted)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("mobile_no_encrypted");
            entity.Property(e => e.OfficialEmailEncrypted)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("official_email_encrypted");
            entity.Property(e => e.ProfilePhotoUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("profile_photo_url");
            entity.Property(e => e.ReportingManagerId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("reporting_manager_id");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");

            entity.HasOne(d => d.DepartmentCodeNavigation).WithMany(p => p.MstEmployees)
                .HasPrincipalKey(p => p.DepartmentCode)
                .HasForeignKey(d => d.DepartmentCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_emp_dept");

            entity.HasOne(d => d.DesignationCodeNavigation).WithMany(p => p.MstEmployees)
                .HasPrincipalKey(p => p.DesignationCode)
                .HasForeignKey(d => d.DesignationCode)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_emp_desg");

            entity.HasOne(d => d.ReportingManager).WithMany(p => p.InverseReportingManager)
                .HasForeignKey(d => d.ReportingManagerId)
                .HasConstraintName("fk_emp_mgr");
        });

        modelBuilder.Entity<MstEmployeeRole>(entity =>
        {
            entity.HasKey(e => e.EmployeeRoleId).HasName("PK__mst_empl__AF99BE5B2FEDC1B3");

            entity.ToTable("mst_employee_role", "role");

            entity.HasIndex(e => new { e.EmpId, e.RoleId }, "uq_emprole").IsUnique();

            entity.Property(e => e.EmployeeRoleId).HasColumnName("employee_role_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.IsDefaultRole)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("N")
                .IsFixedLength()
                .HasColumnName("is_default_role");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");

            entity.HasOne(d => d.Emp).WithMany(p => p.MstEmployeeRoles)
                .HasForeignKey(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_emprole_emp");

            entity.HasOne(d => d.Role).WithMany(p => p.MstEmployeeRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_emprole_role");
        });

        modelBuilder.Entity<MstPasswordHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PK__mst_pass__096AA2E9FCFB8F1A");

            entity.ToTable("mst_password_history", "role");

            entity.Property(e => e.HistoryId).HasColumnName("history_id");
            entity.Property(e => e.ChangedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("changed_by");
            entity.Property(e => e.ChangedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("changed_on");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");

            entity.HasOne(d => d.Emp).WithMany(p => p.MstPasswordHistories)
                .HasForeignKey(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_pwdhist_emp");
        });

        modelBuilder.Entity<MstRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__mst_role__760965CC80B82CD1");

            entity.ToTable("mst_role", "role");

            entity.HasIndex(e => e.RoleName, "UQ__mst_role__783254B18A04981A").IsUnique();

            entity.HasIndex(e => e.RoleCode, "UQ__mst_role__BAE63075CB37C8DB").IsUnique();

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.RoleCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("role_code");
            entity.Property(e => e.RoleName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("role_name");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");
        });

        modelBuilder.Entity<MstUserLogin>(entity =>
        {
            entity.HasKey(e => e.LoginId).HasName("PK__mst_user__C2C971DBB90082CB");

            entity.ToTable("mst_user_login", "role");

            entity.HasIndex(e => e.EmpId, "UQ__mst_user__1299A860B281A0EC").IsUnique();

            entity.HasIndex(e => e.EmpId, "ix_userlogin_emp");

            entity.Property(e => e.LoginId).HasColumnName("login_id");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_date");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.FailedLoginAttempts)
                .HasDefaultValue(0)
                .HasColumnName("failed_login_attempts");
            entity.Property(e => e.ForcePasswordChange)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("N")
                .IsFixedLength()
                .HasColumnName("force_password_change");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.IsFirstLogin)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_first_login");
            entity.Property(e => e.IsLocked)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("N")
                .IsFixedLength()
                .HasColumnName("is_locked");
            entity.Property(e => e.LastLogin)
                .HasColumnType("datetime")
                .HasColumnName("last_login");
            entity.Property(e => e.LastLogout)
                .HasColumnType("datetime")
                .HasColumnName("last_logout");
            entity.Property(e => e.LockTime)
                .HasColumnType("datetime")
                .HasColumnName("lock_time");
            entity.Property(e => e.PasswordChangedDate)
                .HasColumnType("datetime")
                .HasColumnName("password_changed_date");
            entity.Property(e => e.PasswordExpiryDate)
                .HasColumnType("datetime")
                .HasColumnName("password_expiry_date");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
            entity.Property(e => e.UnlockTime)
                .HasColumnType("datetime")
                .HasColumnName("unlock_time");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("updated_by");
            entity.Property(e => e.UpdatedDate)
                .HasColumnType("datetime")
                .HasColumnName("updated_date");

            entity.HasOne(d => d.Emp).WithOne(p => p.MstUserLogin)
                .HasForeignKey<MstUserLogin>(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_login_emp");
        });

        modelBuilder.Entity<TrnLoginHistory>(entity =>
        {
            entity.HasKey(e => e.LoginHistoryId).HasName("PK__trn_logi__B4EA3F2DEBCBBD09");

            entity.ToTable("trn_login_history", "role");

            entity.HasIndex(e => e.EmpId, "ix_loginhist_emp");

            entity.Property(e => e.LoginHistoryId).HasColumnName("login_history_id");
            entity.Property(e => e.Browser)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("browser");
            entity.Property(e => e.DeviceName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("device_name");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.FailureReason)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("failure_reason");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.LoginStatus)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("login_status");
            entity.Property(e => e.LoginTime)
                .HasColumnType("datetime")
                .HasColumnName("login_time");
            entity.Property(e => e.LogoutTime)
                .HasColumnType("datetime")
                .HasColumnName("logout_time");
            entity.Property(e => e.OperatingSystem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("operating_system");

            entity.HasOne(d => d.Emp).WithMany(p => p.TrnLoginHistories)
                .HasForeignKey(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_loginhist_emp");
        });

        modelBuilder.Entity<TrnOtp>(entity =>
        {
            entity.HasKey(e => e.OtpId).HasName("PK__trn_otp__AEE354354D19ADC0");

            entity.ToTable("trn_otp", "role");

            entity.HasIndex(e => e.Token, "ix_otp_token");

            entity.Property(e => e.OtpId).HasColumnName("otp_id");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.ExpiryTime)
                .HasColumnType("datetime")
                .HasColumnName("expiry_time");
            entity.Property(e => e.GeneratedTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("generated_time");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.Otp)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("otp");
            entity.Property(e => e.Purpose)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("purpose");
            entity.Property(e => e.Token)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("token");
            entity.Property(e => e.Verified)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("N")
                .IsFixedLength()
                .HasColumnName("verified");
            entity.Property(e => e.VerifiedTime)
                .HasColumnType("datetime")
                .HasColumnName("verified_time");

            entity.HasOne(d => d.Emp).WithMany(p => p.TrnOtps)
                .HasForeignKey(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_otp_emp");
        });

        modelBuilder.Entity<TrnUserSession>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PK__trn_user__69B13FDC5E1EB1B0");

            entity.ToTable("trn_user_session", "role");

            entity.HasIndex(e => e.RefreshToken, "ix_session_token");

            entity.Property(e => e.SessionId).HasColumnName("session_id");
            entity.Property(e => e.Browser)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("browser");
            entity.Property(e => e.DeviceName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("device_name");
            entity.Property(e => e.EmpId)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("emp_id");
            entity.Property(e => e.ExpiryTime)
                .HasColumnType("datetime")
                .HasColumnName("expiry_time");
            entity.Property(e => e.IpAddress)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("ip_address");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("Y")
                .IsFixedLength()
                .HasColumnName("is_active");
            entity.Property(e => e.JwtToken)
                .IsUnicode(false)
                .HasColumnName("jwt_token");
            entity.Property(e => e.LoginTime)
                .HasColumnType("datetime")
                .HasColumnName("login_time");
            entity.Property(e => e.OperatingSystem)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("operating_system");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("refresh_token");

            entity.HasOne(d => d.Emp).WithMany(p => p.TrnUserSessions)
                .HasForeignKey(d => d.EmpId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_usersession_emp");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
