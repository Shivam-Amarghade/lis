namespace LMSMaster.API.DTOs;

public class ResetPasswordRequest
{
    public string EmpId { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string OtpToken { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
