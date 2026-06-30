namespace LMSMaster.API.DTOs;

public class RoleDto
{
    public int RoleId { get; set; }
    public string RoleCode { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public bool IsDefaultRole { get; set; }
}
