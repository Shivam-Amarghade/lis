namespace LMSMaster.API.DTOs;

public class LoginRequest
{
    public string EmpId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string CaptchaToken { get; set; } = string.Empty;
    public string CaptchaValue { get; set; } = string.Empty;
}
