using System.Security.Cryptography;
using System.Text;

namespace LMSMaster.API.Helpers;

public static class EncryptionHelper
{
    private static byte[] GetKey(string keyString)
    {
        var key = Encoding.UTF8.GetBytes(keyString);
        Array.Resize(ref key, 32); // Ensure it's 256 bits (32 bytes)
        return key;
    }

    private static byte[] GetIv(string ivString)
    {
        var iv = Encoding.UTF8.GetBytes(ivString);
        Array.Resize(ref iv, 16); // Ensure it's 128 bits (16 bytes)
        return iv;
    }

    public static string Encrypt(string plainText, string keyString, string ivString)
    {
        if (string.IsNullOrEmpty(plainText)) return plainText;

        using Aes aesAlg = Aes.Create();
        aesAlg.Key = GetKey(keyString);
        aesAlg.IV = GetIv(ivString);

        ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

        using MemoryStream msEncrypt = new MemoryStream();
        using CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write);
        using StreamWriter swEncrypt = new StreamWriter(csEncrypt);
        swEncrypt.Write(plainText);
        swEncrypt.Flush();
        csEncrypt.FlushFinalBlock();

        return Convert.ToBase64String(msEncrypt.ToArray());
    }

    public static string Decrypt(string cipherText, string keyString, string ivString)
    {
        if (string.IsNullOrEmpty(cipherText)) return cipherText;

        using Aes aesAlg = Aes.Create();
        aesAlg.Key = GetKey(keyString);
        aesAlg.IV = GetIv(ivString);

        ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

        try
        {
            using MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText));
            using CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
            using StreamReader srDecrypt = new StreamReader(csDecrypt);
            return srDecrypt.ReadToEnd();
        }
        catch
        {
            return cipherText; // Fallback or handle appropriately in a real scenario
        }
    }
}
