using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class TrnUserSession
{
    public long SessionId { get; set; }

    public string EmpId { get; set; } = null!;

    public string JwtToken { get; set; } = null!;

    public string? RefreshToken { get; set; }

    public DateTime LoginTime { get; set; }

    public DateTime ExpiryTime { get; set; }

    public string? Browser { get; set; }

    public string? OperatingSystem { get; set; }

    public string? DeviceName { get; set; }

    public string? IpAddress { get; set; }

    public string? IsActive { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;
}
