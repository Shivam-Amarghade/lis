namespace LMSMaster.API.Helpers;

public static class CaptchaHelper
{
    public static (string CaptchaText, string Token) GenerateAlphanumericCaptcha(string encKey, string encIv)
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        var captchaText = new string(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        
        // Token format: captchaText|expiryTicks
        string plainText = $"{captchaText}|{DateTime.UtcNow.AddMinutes(5).Ticks}";
        string token = EncryptionHelper.Encrypt(plainText, encKey, encIv);
        
        return (captchaText, token);
    }
    
    public static bool ValidateCaptcha(string userInput, string token, string encKey, string encIv)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(userInput) || string.IsNullOrWhiteSpace(token)) 
                return false;

            string plainText = EncryptionHelper.Decrypt(token, encKey, encIv);
            var parts = plainText.Split('|');
            if (parts.Length != 2) return false;
            
            string expectedResult = parts[0];
            long expiryTicks = long.Parse(parts[1]);
            
            if (DateTime.UtcNow.Ticks > expiryTicks) return false; // Expired
            if (userInput.Trim() != expectedResult) return false;
            
            return true;
        }
        catch
        {
            return false; // Decryption failed or invalid format
        }
    }
}
