using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class LoginWithOtpRequestValidator : AbstractValidator<LoginWithOtpRequest>
{
    public LoginWithOtpRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.");

        RuleFor(x => x.OtpToken)
            .NotEmpty().WithMessage("OTP Token is required.");

        RuleFor(x => x.CaptchaToken)
            .NotEmpty().WithMessage("Captcha token is required.");

        RuleFor(x => x.CaptchaValue)
            .NotEmpty().WithMessage("Captcha value is required.");
    }
}
