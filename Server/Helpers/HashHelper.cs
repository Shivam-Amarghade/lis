using System.Security.Cryptography;
using System.Text;

namespace LMSMaster.API.Helpers;

public static class HashHelper
{
    public static string ComputeSha256Hash(string rawData)
    {
        if (string.IsNullOrEmpty(rawData)) return rawData;
        
        using SHA256 sha256Hash = SHA256.Create();
        byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

        StringBuilder builder = new StringBuilder();
        foreach (var t in bytes)
        {
            builder.Append(t.ToString("x2"));
        }
        return builder.ToString();
    }
}
