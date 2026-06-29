using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.");
    }
}
