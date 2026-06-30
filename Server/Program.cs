using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using LMSMaster.API.Data;
using LMSMaster.API.Helpers;
using LMSMaster.API.Middleware;
using LMSMaster.API.Repositories;
using LMSMaster.API.Services;
using LMSMaster.API.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS — allow frontend origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",    // Vite dev server
                "http://localhost:3000",    // alternative dev port
                "http://10.213.114.96:5173" // network access
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Configure Entity Framework Core Database First (Simulated)
builder.Services.AddDbContext<LMSMasterContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories and Services
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure Helpers
builder.Services.AddScoped<JwtTokenHelper>();

// Configure FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

// Configure AutoMapper if needed
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"] ?? throw new ArgumentNullException("Jwt:Key is missing");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = System.Security.Claims.ClaimTypes.Role
    };
});

// Configure Swagger with JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS Master API", Version = "v1" });
    
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed Test User
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LMSMasterContext>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    
    string encKey = config["Encryption:Key"] ?? "DefaultEncryptionKey1234567890123456";
    string encIv = config["Encryption:IV"] ?? "DefaultIV1234567";
    string encEmail = EncryptionHelper.Encrypt("anushkasahugenai@gmail.com", encKey, encIv);
    string encMobile = EncryptionHelper.Encrypt("6268503440", encKey, encIv);
    
    // Seed Test User 1 — MPO001 (Anushka Sahu, Admin)
    var existingEmp = context.MstEmployees.FirstOrDefault(e => e.EmpId == "MPO001");
    if (existingEmp == null)
    {
        var emp = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "MPO001",
            EmpName = "Anushka Sahu",
            DepartmentCode = "IT",
            DesignationCode = "DIR",
            OfficialEmailEncrypted = encEmail,
            MobileNoEncrypted = encMobile,
            Gender = "Female",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp);
        
        var login = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "MPO001",
            PasswordHash = LMSMaster.API.Helpers.PasswordHelper.HashPassword("Test@123"),
            IsLocked = "N",
            IsFirstLogin = "Y",
            ForcePasswordChange = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstUserLogins.Add(login);
        
        var role = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO001",
            RoleId = 1, // Admin Role
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role);
        
        context.SaveChanges();
    }

    // Seed Test User 2 — MPO002 (Shivam Amarghade, Employee + Reporting Manager)
    string encEmail2 = EncryptionHelper.Encrypt("shivamamarghade@gmail.com", encKey, encIv);
    var existingEmp2 = context.MstEmployees.FirstOrDefault(e => e.EmpId == "MPO002");
    if (existingEmp2 == null)
    {
        var emp2 = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "MPO002",
            EmpName = "Shivam Amarghade",
            DepartmentCode = "IT",
            DesignationCode = "MGR",
            OfficialEmailEncrypted = encEmail2,
            Gender = "Male",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp2);

        var login2 = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "MPO002",
            PasswordHash = LMSMaster.API.Helpers.PasswordHelper.HashPassword("Test@123"),
            IsLocked = "N",
            IsFirstLogin = "Y",
            ForcePasswordChange = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstUserLogins.Add(login2);

        // Assign Employee Role (Default)
        var role2Emp = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO002",
            RoleId = 3, // EMP Role
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role2Emp);

        // Assign Reporting Manager Role
        var role2Rm = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO002",
            RoleId = 2, // RM Role
            IsDefaultRole = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role2Rm);

        context.SaveChanges();
    }

    // Seed Test User 3 — MPO003 (Anu Kumari, Employee)
    string encEmail3 = EncryptionHelper.Encrypt("anukumari2000005@gmail.com", encKey, encIv);
    var existingEmp3 = context.MstEmployees.FirstOrDefault(e => e.EmpId == "MPO003");
    if (existingEmp3 == null)
    {
        var emp3 = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "MPO003",
            EmpName = "Anu Kumari",
            DepartmentCode = "IT",
            DesignationCode = "SE",
            OfficialEmailEncrypted = encEmail3,
            Gender = "Female",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp3);

        var login3 = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "MPO003",
            PasswordHash = LMSMaster.API.Helpers.PasswordHelper.HashPassword("Test@123"),
            IsLocked = "N",
            IsFirstLogin = "Y",
            ForcePasswordChange = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstUserLogins.Add(login3);

        var role3 = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO003",
            RoleId = 3, // EMP Role
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role3);

        context.SaveChanges();
    }

    // Seed Test User 4 — MPO004 (Rohan Verma, Employee + Reporting Manager)
    string encEmail4 = EncryptionHelper.Encrypt("rohanverma.lms@gmail.com", encKey, encIv);
    var existingEmp4 = context.MstEmployees.FirstOrDefault(e => e.EmpId == "MPO004");
    if (existingEmp4 == null)
    {
        var emp4 = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "MPO004",
            EmpName = "Rohan Verma",
            DepartmentCode = "IT",
            DesignationCode = "MGR",
            OfficialEmailEncrypted = encEmail4,
            Gender = "Male",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp4);

        var login4 = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "MPO004",
            PasswordHash = LMSMaster.API.Helpers.PasswordHelper.HashPassword("Test@123"),
            IsLocked = "N",
            IsFirstLogin = "Y",
            ForcePasswordChange = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstUserLogins.Add(login4);

        // Assign Employee Role (Default)
        var role4Emp = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO004",
            RoleId = 3, // EMP Role
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role4Emp);

        // Assign Reporting Manager Role
        var role4Rm = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "MPO004",
            RoleId = 2, // RM Role
            IsDefaultRole = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role4Rm);

        context.SaveChanges();
    }
    else if (existingEmp4.OfficialEmailEncrypted != encEmail4)
    {
        // Update email if it changed
        existingEmp4.OfficialEmailEncrypted = encEmail4;
        context.MstEmployees.Update(existingEmp4);
        context.SaveChanges();
    }
}

app.Run();
