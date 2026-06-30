namespace LMSMaster.API.Helpers;

public static class Constants
{
    public const int MaxFailedAccessAttempts = 5;
    public const int LockoutDurationMinutes = 30;
    
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Supervisor = "Supervisor";
        public const string Employee = "employee";
    }
}
