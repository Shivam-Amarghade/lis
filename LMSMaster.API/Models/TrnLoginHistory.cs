using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class TrnLoginHistory
{
    public long LoginHistoryId { get; set; }

    public string EmpId { get; set; } = null!;

    public DateTime LoginTime { get; set; }

    public DateTime? LogoutTime { get; set; }

    public string LoginStatus { get; set; } = null!;

    public string? FailureReason { get; set; }

    public string? Browser { get; set; }

    public string? OperatingSystem { get; set; }

    public string? DeviceName { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;
}
