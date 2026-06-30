using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.");
            
        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");
            
        RuleFor(x => x.CaptchaToken)
            .NotEmpty().WithMessage("Captcha token is required.");
            
        RuleFor(x => x.CaptchaValue)
            .NotEmpty().WithMessage("Captcha value is required.");
    }
}
