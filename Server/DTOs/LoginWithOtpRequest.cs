namespace LMSMaster.API.DTOs;

public class LoginWithOtpRequest
{
    public string EmpId { get; set; } = string.Empty;
    public string OtpToken { get; set; } = string.Empty;
    public string CaptchaToken { get; set; } = string.Empty;
    public string CaptchaValue { get; set; } = string.Empty;
}
