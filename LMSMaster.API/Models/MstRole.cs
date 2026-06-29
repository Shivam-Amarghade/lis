using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstRole
{
    public int RoleId { get; set; }

    public string RoleCode { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual ICollection<MstEmployeeRole> MstEmployeeRoles { get; set; } = new List<MstEmployeeRole>();
}
