using FluentValidation;
using LMSMaster.API.DTOs;

namespace LMSMaster.API.Validators;

public class SendLoginOtpRequestValidator : AbstractValidator<SendLoginOtpRequest>
{
    public SendLoginOtpRequestValidator()
    {
        RuleFor(x => x.EmpId)
            .NotEmpty().WithMessage("Employee ID is required.");
    }
}
