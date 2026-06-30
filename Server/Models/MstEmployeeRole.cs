using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstEmployeeRole
{
    public long EmployeeRoleId { get; set; }

    public string EmpId { get; set; } = null!;

    public int RoleId { get; set; }

    public string? IsDefaultRole { get; set; }

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual MstEmployee Emp { get; set; } = null!;

    public virtual MstRole Role { get; set; } = null!;
}
