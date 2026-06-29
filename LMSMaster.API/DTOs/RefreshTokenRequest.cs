namespace LMSMaster.API.DTOs;

public class RefreshTokenRequest
{
    public string JwtToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
