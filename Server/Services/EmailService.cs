using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LMSMaster.API.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        try
        {
            var host = _configuration["Smtp:Host"] ?? "smtp.example.com";
            var portString = _configuration["Smtp:Port"] ?? "587";
            var username = _configuration["Smtp:Username"] ?? "test@example.com";
            var password = _configuration["Smtp:Password"] ?? "password";
            var senderEmail = _configuration["Smtp:SenderEmail"] ?? "no-reply@example.com";

            if (!int.TryParse(portString, out int port))
            {
                port = 587;
            }

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            // Fire and forget so the API responds instantly
            _ = Task.Run(async () =>
            {
                try
                {
                    using var client = new SmtpClient(host, port)
                    {
                        Credentials = new NetworkCredential(username, password),
                        EnableSsl = true
                    };
                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation("Email successfully sent to {Email}", toEmail);
                }
                catch (Exception innerEx)
                {
                    _logger.LogError(innerEx, "Failed to send email to {Email}", toEmail);
                }
                finally
                {
                    mailMessage.Dispose();
                }
            });

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to prepare email to {Email}", toEmail);
        }
    }
}
