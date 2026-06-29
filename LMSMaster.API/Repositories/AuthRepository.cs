using Microsoft.EntityFrameworkCore;
using LMSMaster.API.Data;
using LMSMaster.API.Models;

namespace LMSMaster.API.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly LMSMasterContext _context;

    public AuthRepository(LMSMasterContext context)
    {
        _context = context;
    }

    public async Task<MstEmployee?> GetEmployeeByIdAsync(string empId)
    {
        return await _context.MstEmployees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.EmpId == empId);
    }

    public async Task<MstEmployee?> GetEmployeeByEmailAsync(string encryptedEmail)
    {
        return await _context.MstEmployees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.OfficialEmailEncrypted == encryptedEmail);
    }

    public async Task<MstEmployee?> GetEmployeeByMobileAsync(string encryptedMobile)
    {
        return await _context.MstEmployees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.MobileNoEncrypted == encryptedMobile);
    }

    public async Task<MstUserLogin?> GetUserLoginByEmpIdAsync(string empId)
    {
        return await _context.MstUserLogins
            .FirstOrDefaultAsync(u => u.EmpId == empId && u.IsActive == "Y");
    }

    public async Task UpdateUserLoginAsync(MstUserLogin userLogin)
    {
        _context.MstUserLogins.Update(userLogin);
        await _context.SaveChangesAsync();
    }

    public async Task<List<MstRole>> GetEmployeeRolesAsync(string empId)
    {
        return await _context.MstEmployeeRoles
            .AsNoTracking()
            .Include(er => er.Role)
            .Where(er => er.EmpId == empId && er.IsActive == "Y" && er.Role.IsActive == "Y")
            .Select(er => er.Role)
            .ToListAsync();
    }

    public async Task AddLoginHistoryAsync(TrnLoginHistory loginHistory)
    {
        _context.TrnLoginHistories.Add(loginHistory);
        await _context.SaveChangesAsync();
    }

    public async Task AddPasswordHistoryAsync(MstPasswordHistory passwordHistory)
    {
        _context.MstPasswordHistories.Add(passwordHistory);
        await _context.SaveChangesAsync();
    }

    public async Task<List<MstPasswordHistory>> GetRecentPasswordHistoryAsync(string empId, int count = 3)
    {
        return await _context.MstPasswordHistories
            .AsNoTracking()
            .Where(p => p.EmpId == empId)
            .OrderByDescending(p => p.ChangedOn)
            .Take(count)
            .ToListAsync();
    }

    public async Task AddOtpAsync(TrnOtp otp)
    {
        _context.TrnOtps.Add(otp);
        await _context.SaveChangesAsync();
    }

    public async Task<TrnOtp?> GetOtpByTokenAsync(string token)
    {
        return await _context.TrnOtps
            .FirstOrDefaultAsync(o => o.Token == token && o.Verified == "N");
    }

    public async Task UpdateOtpAsync(TrnOtp otp)
    {
        _context.TrnOtps.Update(otp);
        await _context.SaveChangesAsync();
    }

    public async Task AddUserSessionAsync(TrnUserSession session)
    {
        _context.TrnUserSessions.Add(session);
        await _context.SaveChangesAsync();
    }

    public async Task<TrnUserSession?> GetUserSessionByRefreshTokenAsync(string refreshToken)
    {
        return await _context.TrnUserSessions
            .FirstOrDefaultAsync(s => s.RefreshToken == refreshToken && s.IsActive == "Y");
    }

    public async Task UpdateUserSessionAsync(TrnUserSession session)
    {
        _context.TrnUserSessions.Update(session);
        await _context.SaveChangesAsync();
    }

    public async Task RevokeAllUserSessionsAsync(string empId)
    {
        var activeSessions = await _context.TrnUserSessions
            .Where(s => s.EmpId == empId && s.IsActive == "Y")
            .ToListAsync();
            
        foreach (var session in activeSessions)
        {
            session.IsActive = "N";
        }
        
        await _context.SaveChangesAsync();
    }
}
