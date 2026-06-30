using System.Collections.Generic;

namespace LMSMaster.API.DTOs;

public class LoginResponse
{
    public string EmployeeId { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string DefaultRole { get; set; } = string.Empty;
    public bool ShowRoleSwitcher { get; set; }
    public List<RoleDto> Roles { get; set; } = new();
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public bool IsFirstLogin { get; set; }
}
