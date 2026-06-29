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

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email successfully sent to {Email}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            // We swallow the exception here so the API doesn't crash if SMTP is not configured
        }
    }
}
