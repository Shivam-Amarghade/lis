using System;
using System.Collections.Generic;

namespace LMSMaster.API.Models;

public partial class MstDesignation
{
    public int DesignationId { get; set; }

    public string DesignationCode { get; set; } = null!;

    public string DesignationName { get; set; } = null!;

    public string? IsActive { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public string? IpAddress { get; set; }

    public virtual ICollection<MstEmployee> MstEmployees { get; set; } = new List<MstEmployee>();
}
