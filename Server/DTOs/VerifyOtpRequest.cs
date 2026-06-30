namespace LMSMaster.API.DTOs;

public class VerifyOtpRequest
{
    public string EmpId { get; set; } = string.Empty;
    public string OtpToken { get; set; } = string.Empty;
}
