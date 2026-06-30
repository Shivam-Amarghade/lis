using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.")
            .MaximumLength(10).WithMessage("Employee ID must not exceed 10 characters.")
            .Matches(@"^[A-Za-z0-9]+$").WithMessage("Employee ID must contain only alphanumeric characters.");
    }
}
