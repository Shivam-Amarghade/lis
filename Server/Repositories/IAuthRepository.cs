using LMSMaster.API.Models;

namespace LMSMaster.API.Repositories;

public interface IAuthRepository
{
    Task<MstEmployee?> GetEmployeeByIdAsync(string empId);
    Task<MstEmployee?> GetEmployeeByEmailAsync(string encryptedEmail);
    Task<MstEmployee?> GetEmployeeByMobileAsync(string encryptedMobile);
    
    Task<MstUserLogin?> GetUserLoginByEmpIdAsync(string empId);
    Task UpdateUserLoginAsync(MstUserLogin userLogin);
    
    Task<List<MstRole>> GetEmployeeRolesAsync(string empId);
    
    Task AddLoginHistoryAsync(TrnLoginHistory loginHistory);
    Task AddPasswordHistoryAsync(MstPasswordHistory passwordHistory);
    Task<List<MstPasswordHistory>> GetRecentPasswordHistoryAsync(string empId, int count = 3);
    
    Task AddOtpAsync(TrnOtp otp);
    Task<TrnOtp?> GetOtpByTokenAsync(string token);
    Task UpdateOtpAsync(TrnOtp otp);

    Task AddUserSessionAsync(TrnUserSession session);
    Task<TrnUserSession?> GetUserSessionByRefreshTokenAsync(string refreshToken);
    Task UpdateUserSessionAsync(TrnUserSession session);
    Task RevokeAllUserSessionsAsync(string empId);

    Task AddRoleSwitchHistoryAsync(TrnRoleSwitchHistory history);
    Task<MstEmployeeRole?> GetEmployeeRoleByIdAsync(string empId, int roleId);
    Task<List<MstEmployeeRole>> GetEmployeeRolesWithJoinAsync(string empId);
}
