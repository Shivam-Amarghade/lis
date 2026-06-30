using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstEmployee
{
    public string EmpId { get; set; } = null!;

    public string EmpName { get; set; } = null!;

    public string DepartmentCode { get; set; } = null!;

    public string DesignationCode { get; set; } = null!;

    public string? ReportingManagerId { get; set; }

    public string OfficialEmailEncrypted { get; set; } = null!;

    public string? MobileNoEncrypted { get; set; }

    public string? ProfilePhotoUrl { get; set; }

    public string? Gender { get; set; }

    public DateOnly? Dob { get; set; }

    public DateOnly? JoiningDate { get; set; }

    public string? EmployeeStatus { get; set; }

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstDepartment DepartmentCodeNavigation { get; set; } = null!;

    public virtual MstDesignation DesignationCodeNavigation { get; set; } = null!;

    public virtual ICollection<MstEmployee> InverseReportingManager { get; set; } = new List<MstEmployee>();

    public virtual ICollection<MstEmployeeRole> MstEmployeeRoles { get; set; } = new List<MstEmployeeRole>();

    public virtual ICollection<MstPasswordHistory> MstPasswordHistories { get; set; } = new List<MstPasswordHistory>();

    public virtual MstUserLogin? MstUserLogin { get; set; }

    public virtual MstEmployee? ReportingManager { get; set; }

    public virtual ICollection<TrnLoginHistory> TrnLoginHistories { get; set; } = new List<TrnLoginHistory>();

    public virtual ICollection<TrnOtp> TrnOtps { get; set; } = new List<TrnOtp>();

    public virtual ICollection<TrnUserSession> TrnUserSessions { get; set; } = new List<TrnUserSession>();
}
