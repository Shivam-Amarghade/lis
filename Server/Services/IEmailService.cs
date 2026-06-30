using System.Threading.Tasks;

namespace LMSMaster.API.Services;

public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string body);
}
