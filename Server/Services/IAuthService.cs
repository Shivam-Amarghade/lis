using LMSMaster.API.DTOs;

namespace LMSMaster.API.Services;

public interface IAuthService
{
    Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<object>> LogoutAsync(string empId);
    Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ApiResponse<string>> VerifyOtpAsync(VerifyOtpRequest request);
    Task<ApiResponse<object>> ResetPasswordAsync(ResetPasswordRequest request);
    
    Task<ApiResponse<object>> SendLoginOtpAsync(SendLoginOtpRequest request);
    Task<ApiResponse<LoginResponse>> LoginWithOtpAsync(LoginWithOtpRequest request);
    Task<SwitchRoleResponse> SwitchRoleAsync(string empId, string currentRoleCode, int targetRoleId, string ipAddress, string userAgent);
}
