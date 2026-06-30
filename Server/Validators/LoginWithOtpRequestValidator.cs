using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class LoginWithOtpRequestValidator : AbstractValidator<LoginWithOtpRequest>
{
    public LoginWithOtpRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.")
            .MaximumLength(10).WithMessage("Employee ID must not exceed 10 characters.")
            .Matches(@"^[A-Za-z0-9]+$").WithMessage("Employee ID must contain only alphanumeric characters.");

        RuleFor(x => x.OtpToken)
            .NotEmpty().WithMessage("OTP is required.")
            .Length(6, 6).WithMessage("OTP must be exactly 6 digits.")
            .Matches(@"^\d{6}$").WithMessage("OTP must contain only digits.");

        RuleFor(x => x.CaptchaToken)
            .NotEmpty().WithMessage("Captcha token is required.");

        RuleFor(x => x.CaptchaValue)
            .NotEmpty().WithMessage("Captcha value is required.")
            .Length(6, 6).WithMessage("Captcha value must be exactly 6 characters.")
            .Matches(@"^[A-Za-z0-9]+$").WithMessage("Captcha value must be alphanumeric.");
    }
}
