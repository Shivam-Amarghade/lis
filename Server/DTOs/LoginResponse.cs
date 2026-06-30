namespace LMSMaster.API.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string EmpId { get; set; } = string.Empty;
    public string EmpName { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public bool IsFirstLogin { get; set; }
}
