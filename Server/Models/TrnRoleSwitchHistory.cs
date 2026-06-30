using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class TrnRoleSwitchHistory
{
    public long SwitchId { get; set; }

    public string EmpId { get; set; } = null!;

    public int OldRoleId { get; set; }

    public int NewRoleId { get; set; }

    public DateTime SwitchTime { get; set; }

    public string? IpAddress { get; set; }

    public string? Browser { get; set; }

    public string? DeviceName { get; set; }

    public DateTime CreatedDate { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;

    public virtual MstRole NewRole { get; set; } = null!;

    public virtual MstRole OldRole { get; set; } = null!;
}
