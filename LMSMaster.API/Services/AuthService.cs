using LMSMaster.API.DTOs;
using LMSMaster.API.Helpers;
using LMSMaster.API.Repositories;
using LMSMaster.API.Models;

namespace LMSMaster.API.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly JwtTokenHelper _jwtTokenHelper;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;

    public AuthService(IAuthRepository authRepository, JwtTokenHelper jwtTokenHelper, IConfiguration configuration, IEmailService emailService)
    {
        _authRepository = authRepository;
        _jwtTokenHelper = jwtTokenHelper;
        _configuration = configuration;
        _emailService = emailService;
    }

    public async Task<ApiResponse<LoginResponse>> LoginAsync(LoginRequest request)
    {
        string encKey = _configuration["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
        string encIv = _configuration["Encryption:IV"] ?? "DefaultIV1234567";

        // Validate Captcha
        if (!CaptchaHelper.ValidateCaptcha(request.CaptchaValue, request.CaptchaToken, encKey, encIv))
        {
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid or expired Captcha.");
        }

        MstEmployee? employee = null;
        string loginId = request.EmpId.Trim();

        // 1. Fetch Employee by ID
        employee = await _authRepository.GetEmployeeByIdAsync(loginId.ToUpper());

        if (employee == null || employee.IsActive != "Y")
        {
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid credentials or inactive account.");
        }

        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(employee.EmpId);
        if (userLogin == null || userLogin.IsActive != "Y")
        {
            return ApiResponse<LoginResponse>.ErrorResponse("No active login profile assigned.");
        }

        // Lockout Check
        if (userLogin.IsLocked == "Y")
        {
            if (userLogin.LockTime.HasValue && userLogin.LockTime.Value.AddMinutes(30) > DateTime.UtcNow)
            {
                await LogLoginHistoryAsync(employee.EmpId, "Failed", "Account locked");
                return ApiResponse<LoginResponse>.ErrorResponse($"Account is locked. Try again after {userLogin.LockTime.Value.ToLocalTime().AddMinutes(30):g}");
            }
            else
            {
                userLogin.IsLocked = "N";
                userLogin.FailedLoginAttempts = 0;
                userLogin.LockTime = null;
                await _authRepository.UpdateUserLoginAsync(userLogin);
            }
        }

        bool isPasswordValid = PasswordHelper.VerifyPassword(request.Password, userLogin.PasswordHash);

        if (!isPasswordValid)
        {
            userLogin.FailedLoginAttempts = (userLogin.FailedLoginAttempts ?? 0) + 1;
            if (userLogin.FailedLoginAttempts >= 5)
            {
                userLogin.IsLocked = "Y";
                userLogin.LockTime = DateTime.UtcNow;
                await _authRepository.UpdateUserLoginAsync(userLogin);
                await LogLoginHistoryAsync(employee.EmpId, "Failed", "Account locked due to multiple failed attempts");
                return ApiResponse<LoginResponse>.ErrorResponse("Account locked due to multiple failed login attempts.");
            }
            
            await _authRepository.UpdateUserLoginAsync(userLogin);
            await LogLoginHistoryAsync(employee.EmpId, "Failed", "Invalid Credentials");
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid Credentials");
        }

        // Successful Login
        userLogin.FailedLoginAttempts = 0;
        userLogin.LastLogin = DateTime.UtcNow;
        userLogin.IsLocked = "N";
        userLogin.LockTime = null;
        userLogin.UpdatedDate = DateTime.UtcNow;
        userLogin.UpdatedBy = employee.EmpId;

        await _authRepository.UpdateUserLoginAsync(userLogin);
        await LogLoginHistoryAsync(employee.EmpId, "Success", null);

        var roles = await _authRepository.GetEmployeeRolesAsync(employee.EmpId);
        int mainRoleId = roles.FirstOrDefault()?.RoleId ?? 0;
        string mainRoleName = roles.FirstOrDefault()?.RoleName ?? string.Empty;

        string token = _jwtTokenHelper.GenerateJwtToken(employee.EmpId, employee.EmpName, mainRoleId, mainRoleName);
        string refreshToken = Guid.NewGuid().ToString("N");

        await _authRepository.AddUserSessionAsync(new TrnUserSession
        {
            EmpId = employee.EmpId,
            JwtToken = token,
            RefreshToken = refreshToken,
            LoginTime = DateTime.UtcNow,
            ExpiryTime = DateTime.UtcNow.AddDays(7),
            IsActive = "Y"
        });

        var response = new LoginResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            EmpId = employee.EmpId,
            EmpName = employee.EmpName,
            Roles = roles.Select(r => r.RoleName).ToList(),
            IsFirstLogin = userLogin.IsFirstLogin == "Y"
        };

        return ApiResponse<LoginResponse>.SuccessResponse(response, "Login Successful");
    }

    private async Task LogLoginHistoryAsync(string empId, string status, string? reason)
    {
        await _authRepository.AddLoginHistoryAsync(new TrnLoginHistory
        {
            EmpId = empId,
            LoginTime = DateTime.UtcNow,
            LoginStatus = status,
            FailureReason = reason
        });
    }

    public async Task<ApiResponse<object>> LogoutAsync(string empId)
    {
        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(empId);
        if (userLogin != null)
        {
            userLogin.LastLogout = DateTime.UtcNow;
            await _authRepository.UpdateUserLoginAsync(userLogin);
        }
        
        await _authRepository.RevokeAllUserSessionsAsync(empId);
        
        return ApiResponse<object>.SuccessResponse(null, "Logout Successful");
    }

    public async Task<ApiResponse<LoginResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var session = await _authRepository.GetUserSessionByRefreshTokenAsync(request.RefreshToken);
        if (session == null || session.JwtToken != request.JwtToken || session.ExpiryTime < DateTime.UtcNow)
        {
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid or expired refresh token");
        }

        var employee = await _authRepository.GetEmployeeByIdAsync(session.EmpId);
        if (employee == null) return ApiResponse<LoginResponse>.ErrorResponse("Employee not found");

        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(session.EmpId);
        if (userLogin == null) return ApiResponse<LoginResponse>.ErrorResponse("Employee login record not found");

        var roles = await _authRepository.GetEmployeeRolesAsync(session.EmpId);
        int mainRoleId = roles.FirstOrDefault()?.RoleId ?? 0;
        string mainRoleName = roles.FirstOrDefault()?.RoleName ?? string.Empty;

        string newToken = _jwtTokenHelper.GenerateJwtToken(employee.EmpId, employee.EmpName, mainRoleId, mainRoleName);
        string newRefreshToken = Guid.NewGuid().ToString("N");

        session.IsActive = "N";
        await _authRepository.UpdateUserSessionAsync(session);

        await _authRepository.AddUserSessionAsync(new TrnUserSession
        {
            EmpId = employee.EmpId,
            JwtToken = newToken,
            RefreshToken = newRefreshToken,
            LoginTime = DateTime.UtcNow,
            ExpiryTime = DateTime.UtcNow.AddDays(7),
            IsActive = "Y"
        });

        var response = new LoginResponse
        {
            Token = newToken,
            RefreshToken = newRefreshToken,
            EmpId = employee.EmpId,
            EmpName = employee.EmpName,
            Roles = roles.Select(r => r.RoleName).ToList(),
            IsFirstLogin = userLogin.IsFirstLogin == "Y"
        };

        return ApiResponse<LoginResponse>.SuccessResponse(response, "Token refreshed successfully");
    }

    public async Task<ApiResponse<object>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        string encKey = _configuration["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
        string encIv = _configuration["Encryption:IV"] ?? "DefaultIV1234567";

        var employee = await _authRepository.GetEmployeeByIdAsync(request.EmpId);
        if (employee == null || employee.IsActive != "Y") return ApiResponse<object>.ErrorResponse("Employee not found");
        
        var random = new Random();
        string otpCode = random.Next(100000, 999999).ToString();
        
        await _authRepository.AddOtpAsync(new TrnOtp
        {
            EmpId = employee.EmpId,
            Token = otpCode,
            Purpose = "PASSWORD_RESET",
            GeneratedTime = DateTime.UtcNow,
            ExpiryTime = DateTime.UtcNow.AddMinutes(15),
            Verified = "N"
        });

        // Send Email
        string officialEmail = EncryptionHelper.Decrypt(employee.OfficialEmailEncrypted, encKey, encIv);
        string subject = "Your LMS Password Reset OTP";
        string body = $"<h2>Password Reset OTP</h2><p>Your One-Time Password to reset your password is: <b>{otpCode}</b></p><p>This code will expire in 15 minutes. Do not share it with anyone.</p>";
        await _emailService.SendEmailAsync(officialEmail, subject, body);

        return ApiResponse<object>.SuccessResponse(new { ResetToken = otpCode }, "Password reset OTP sent to your registered email");
    }

    public async Task<ApiResponse<string>> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var employee = await _authRepository.GetEmployeeByIdAsync(request.EmpId);

        if (employee == null)
            return ApiResponse<string>.ErrorResponse("Employee not found.");

        var otp = await _authRepository.GetOtpByTokenAsync(request.OtpToken);
        if (otp == null || otp.EmpId != employee.EmpId || otp.Purpose != "PASSWORD_RESET" || otp.ExpiryTime < DateTime.UtcNow)
        {
            return ApiResponse<string>.ErrorResponse("Invalid or expired OTP.");
        }

        return ApiResponse<string>.SuccessResponse("OTP is valid.");
    }

    public async Task<ApiResponse<object>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OtpToken)) return ApiResponse<object>.ErrorResponse("Invalid or missing reset token");

        var otp = await _authRepository.GetOtpByTokenAsync(request.OtpToken);
        if (otp == null || otp.EmpId != request.EmpId || otp.Purpose != "PASSWORD_RESET" || otp.ExpiryTime < DateTime.UtcNow)
        {
            return ApiResponse<object>.ErrorResponse("Invalid or expired reset token");
        }

        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(request.EmpId);
        if (userLogin == null) return ApiResponse<object>.ErrorResponse("Employee login record not found");

        var recentPasswords = await _authRepository.GetRecentPasswordHistoryAsync(request.EmpId, 3);
        if (recentPasswords.Any(p => PasswordHelper.VerifyPassword(request.NewPassword, p.PasswordHash)))
            return ApiResponse<object>.ErrorResponse("New password cannot be one of the last 3 passwords.");

        await _authRepository.AddPasswordHistoryAsync(new MstPasswordHistory
        {
            EmpId = request.EmpId,
            PasswordHash = userLogin.PasswordHash,
            ChangedOn = DateTime.UtcNow,
            ChangedBy = request.EmpId
        });

        userLogin.PasswordHash = PasswordHelper.HashPassword(request.NewPassword);
        userLogin.PasswordChangedDate = DateTime.UtcNow;
        userLogin.IsLocked = "N";
        userLogin.FailedLoginAttempts = 0;
        userLogin.LockTime = null;
        userLogin.UpdatedDate = DateTime.UtcNow;
        userLogin.UpdatedBy = request.EmpId;

        await _authRepository.UpdateUserLoginAsync(userLogin);
        
        otp.Verified = "Y";
        otp.VerifiedTime = DateTime.UtcNow;

        await _authRepository.UpdateOtpAsync(otp);

        return ApiResponse<object>.SuccessResponse(null, "Password reset successfully.");
    }

    public async Task<ApiResponse<object>> SendLoginOtpAsync(SendLoginOtpRequest request)
    {
        string encKey = _configuration["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
        string encIv = _configuration["Encryption:IV"] ?? "DefaultIV1234567";

        MstEmployee? employee = null;
        string loginId = request.EmpId.Trim();

        employee = await _authRepository.GetEmployeeByIdAsync(loginId.ToUpper());

        if (employee == null || employee.IsActive != "Y")
            return ApiResponse<object>.ErrorResponse("Invalid user or inactive account.");

        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(employee.EmpId);
        if (userLogin == null || userLogin.IsActive != "Y" || userLogin.IsLocked == "Y")
            return ApiResponse<object>.ErrorResponse("Account is locked or inactive.");

        // Generate 6-digit numeric OTP
        var random = new Random();
        string otpCode = random.Next(100000, 999999).ToString();

        var otpRecord = new TrnOtp
        {
            EmpId = employee.EmpId,
            Token = otpCode,
            Purpose = "LOGIN_OTP",
            GeneratedTime = DateTime.UtcNow,
            ExpiryTime = DateTime.UtcNow.AddMinutes(5),
            Verified = "N"
        };
        await _authRepository.AddOtpAsync(otpRecord);

        // Send Email
        string officialEmail = EncryptionHelper.Decrypt(employee.OfficialEmailEncrypted, encKey, encIv);
        string subject = "Your LMS Login OTP";
        string body = $"<h2>Login OTP</h2><p>Your One-Time Password for login is: <b>{otpCode}</b></p><p>This code will expire in 5 minutes. Do not share it with anyone.</p>";
        await _emailService.SendEmailAsync(officialEmail, subject, body);

        // For testing purposes, we return the OTP. In production, remove the Data payload!
        return ApiResponse<object>.SuccessResponse(new { Otp = otpCode }, "Login OTP sent successfully to your registered email.");
    }

    public async Task<ApiResponse<LoginResponse>> LoginWithOtpAsync(LoginWithOtpRequest request)
    {
        string encKey = _configuration["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
        string encIv = _configuration["Encryption:IV"] ?? "DefaultIV1234567";

        MstEmployee? employee = null;
        string loginId = request.EmpId.Trim();

        employee = await _authRepository.GetEmployeeByIdAsync(loginId.ToUpper());

        if (employee == null || employee.IsActive != "Y")
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid user or inactive account.");

        var userLogin = await _authRepository.GetUserLoginByEmpIdAsync(employee.EmpId);
        if (userLogin == null || userLogin.IsActive != "Y" || userLogin.IsLocked == "Y")
            return ApiResponse<LoginResponse>.ErrorResponse("Account is locked or inactive.");

        // Validate Captcha
        if (!CaptchaHelper.ValidateCaptcha(request.CaptchaValue, request.CaptchaToken, encKey, encIv))
        {
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid or expired Captcha.");
        }

        var otpRecord = await _authRepository.GetOtpByTokenAsync(request.OtpToken);
        if (otpRecord == null || otpRecord.Verified == "Y" || otpRecord.Purpose != "LOGIN_OTP" || otpRecord.EmpId != employee.EmpId || otpRecord.ExpiryTime < DateTime.UtcNow)
        {
            return ApiResponse<LoginResponse>.ErrorResponse("Invalid or expired OTP.");
        }

        // OTP is valid! Log the user in
        otpRecord.Verified = "Y";
        otpRecord.VerifiedTime = DateTime.UtcNow;
        await _authRepository.UpdateOtpAsync(otpRecord);

        userLogin.LastLogin = DateTime.UtcNow;
        userLogin.FailedLoginAttempts = 0;
        await _authRepository.UpdateUserLoginAsync(userLogin);

        var roles = await _authRepository.GetEmployeeRolesAsync(employee.EmpId);
        var role = roles.FirstOrDefault();
        int roleId = role?.RoleId ?? 0;
        string roleName = role?.RoleName ?? "User";
        List<string> roleNames = roles.Select(r => r.RoleName).ToList();

        string jwtToken = _jwtTokenHelper.GenerateJwtToken(employee.EmpId, employee.EmpName, roleId, roleName);
        string refreshToken = Guid.NewGuid().ToString("N");

        var newSession = new TrnUserSession
        {
            EmpId = employee.EmpId,
            JwtToken = jwtToken,
            RefreshToken = refreshToken,
            ExpiryTime = DateTime.UtcNow.AddDays(7),
            IsActive = "Y",
            LoginTime = DateTime.UtcNow,
            IpAddress = "127.0.0.1",
            Browser = "Unknown",
            DeviceName = "Unknown",
            OperatingSystem = "Unknown"
        };
        await _authRepository.AddUserSessionAsync(newSession);

        var history = new TrnLoginHistory
        {
            EmpId = employee.EmpId,
            LoginTime = DateTime.UtcNow,
            IpAddress = "127.0.0.1",
            LoginStatus = "Success",
            FailureReason = null,
            Browser = "Unknown",
            DeviceName = "Unknown",
            OperatingSystem = "Unknown"
        };
        await _authRepository.AddLoginHistoryAsync(history);

        var responseData = new LoginResponse
        {
            Token = jwtToken,
            RefreshToken = refreshToken,
            EmpId = employee.EmpId,
            EmpName = employee.EmpName,
            Roles = roleNames,
            IsFirstLogin = userLogin.IsFirstLogin == "Y"
        };

        return ApiResponse<LoginResponse>.SuccessResponse(responseData, "Login Successful");
    }
}
