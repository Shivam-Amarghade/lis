using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstPasswordHistory
{
    public long HistoryId { get; set; }

    public string EmpId { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime? ChangedOn { get; set; }

    public string? ChangedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;
}
