using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMSMaster.API.DTOs;
using LMSMaster.API.Services;
using System.Security.Claims;

namespace LMSMaster.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Generates an alphanumeric captcha for login.
    /// </summary>
    [HttpGet("captcha")]
    [AllowAnonymous]
    public IActionResult GetCaptcha()
    {
        var config = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
        string encKey = config["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
        string encIv = config["Encryption:IV"] ?? "DefaultIV1234567";

        var captcha = LMSMaster.API.Helpers.CaptchaHelper.GenerateAlphanumericCaptcha(encKey, encIv);
        return Ok(new { captchaText = captcha.CaptchaText, token = captcha.Token });
    }

    /// <summary>
    /// Authenticates an employee and returns a JWT token.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var response = await _authService.LoginAsync(request);
        return response.Success ? Ok(response) : Unauthorized(response);
    }

    /// <summary>
    /// Logs out the employee.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var empId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var response = await _authService.LogoutAsync(empId);
        return Ok(response);
    }

    /// <summary>
    /// Refreshes the JWT token.
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var response = await _authService.RefreshTokenAsync(request);
        return response.Success ? Ok(response) : Unauthorized(response);
    }

    /// <summary>
    /// Initiates the forgot password process.
    /// </summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var response = await _authService.ForgotPasswordAsync(request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    [HttpPost("verify-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var response = await _authService.VerifyOtpAsync(request);
        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    /// <summary>
    /// Resets the user's password using the OTP token.
    /// </summary>
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var response = await _authService.ResetPasswordAsync(request);
        return response.Success ? Ok(response) : BadRequest(response);
    }

    /// <summary>
    /// Sends an OTP to the user's email for passwordless login.
    /// </summary>
    [HttpPost("send-login-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> SendLoginOtp([FromBody] SendLoginOtpRequest request)
    {
        var response = await _authService.SendLoginOtpAsync(request);
        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    /// <summary>
    /// Authenticates a user securely using an OTP sent to their email.
    /// </summary>
    [HttpPost("login-with-otp")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginWithOtp([FromBody] LoginWithOtpRequest request)
    {
        var response = await _authService.LoginWithOtpAsync(request);
        if (!response.Success)
            return Unauthorized(response);

        return Ok(response);
    }
}
