namespace LMSMaster.API.DTOs;

public class SwitchRoleResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string CurrentRole { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
}
