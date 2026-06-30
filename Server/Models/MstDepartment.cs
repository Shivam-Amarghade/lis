using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstDepartment
{
    public int DepartmentId { get; set; }

    public string DepartmentCode { get; set; } = null!;

    public string DepartmentName { get; set; } = null!;

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual ICollection<MstEmployee> MstEmployees { get; set; } = new List<MstEmployee>();
}
