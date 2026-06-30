using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.");

        RuleFor(x => x.OtpToken)
            .NotEmpty().WithMessage("OTP token is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one number.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.NewPassword).WithMessage("Confirm password must match the new password.");
    }
}
