using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.")
            .MaximumLength(10).WithMessage("Employee ID must not exceed 10 characters.")
            .Matches(@"^[A-Za-z0-9]+$").WithMessage("Employee ID must contain only alphanumeric characters.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
            .MaximumLength(100).WithMessage("Password must not exceed 100 characters.");

        RuleFor(x => x.CaptchaToken)
            .NotEmpty().WithMessage("Captcha token is required.");

        RuleFor(x => x.CaptchaValue)
            .NotEmpty().WithMessage("Captcha value is required.")
            .Length(6, 6).WithMessage("Captcha value must be exactly 6 characters.")
            .Matches(@"^[A-Za-z0-9]+$").WithMessage("Captcha value must be alphanumeric.");
    }
}
