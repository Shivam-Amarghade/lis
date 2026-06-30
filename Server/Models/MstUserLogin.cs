using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstUserLogin
{
    public long LoginId { get; set; }

    public string EmpId { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int? FailedLoginAttempts { get; set; }

    public string? IsLocked { get; set; }

    public DateTime? LockTime { get; set; }

    public DateTime? UnlockTime { get; set; }

    public DateTime? LastLogin { get; set; }

    public DateTime? LastLogout { get; set; }

    public DateTime? PasswordChangedDate { get; set; }

    public DateTime? PasswordExpiryDate { get; set; }

    public string? IsFirstLogin { get; set; }

    public string? ForcePasswordChange { get; set; }

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;
}
