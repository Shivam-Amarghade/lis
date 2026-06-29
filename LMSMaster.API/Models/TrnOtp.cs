using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class TrnOtp
{
    public long OtpId { get; set; }

    public string EmpId { get; set; } = null!;

    public string? Token { get; set; }

    public string? Otp { get; set; }

    public string Purpose { get; set; } = null!;

    public DateTime? GeneratedTime { get; set; }

    public DateTime ExpiryTime { get; set; }

    public string? Verified { get; set; }

    public DateTime? VerifiedTime { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;
}
