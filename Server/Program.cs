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
        ClockSkew = TimeSpan.Zero
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
    string encEmail = EncryptionHelper.Encrypt("anukumari2000005@gmail.com", encKey, encIv);
    
    string encMobile = EncryptionHelper.Encrypt("6268503440", encKey, encIv);
    
    var existingEmp = context.MstEmployees.FirstOrDefault(e => e.EmpId == "TEST001");
    if (existingEmp == null)
    {
        var emp = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "TEST001",
            EmpName = "Anu Kumari",
            DepartmentCode = "IT",
            DesignationCode = "SE",
            OfficialEmailEncrypted = encEmail,
            MobileNoEncrypted = encMobile,
            Gender = "Female",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp);
        // ... login and role ...
        
        var login = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "TEST001",
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
            EmpId = "TEST001",
            RoleId = 3, // EMP Role
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(role);
        
        context.SaveChanges();
    }
    else if (existingEmp.MobileNoEncrypted != encMobile)
    {
        existingEmp.MobileNoEncrypted = encMobile;
        context.MstEmployees.Update(existingEmp);
        context.SaveChanges();
    }

    // --- SEED TEST002 ---
    var existingEmp2 = context.MstEmployees.FirstOrDefault(e => e.EmpId == "TEST002");
    if (existingEmp2 == null)
    {
        var emp2 = new LMSMaster.API.Models.MstEmployee
        {
            EmpId = "TEST002",
            EmpName = "Shivam Admin",
            DepartmentCode = "IT",
            DesignationCode = "MGR",
            OfficialEmailEncrypted = encEmail,
            MobileNoEncrypted = encMobile,
            Gender = "Male",
            EmployeeStatus = "Active",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployees.Add(emp2);
        
        var login2 = new LMSMaster.API.Models.MstUserLogin
        {
            EmpId = "TEST002",
            PasswordHash = LMSMaster.API.Helpers.PasswordHelper.HashPassword("Shivam@1234"),
            IsLocked = "N",
            IsFirstLogin = "N",
            ForcePasswordChange = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstUserLogins.Add(login2);
        
        // Add ADM Role (Role ID 1)
        var roleAdm = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "TEST002",
            RoleId = 1, // ADM
            IsDefaultRole = "Y",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(roleAdm);

        // Add EMP Role (Role ID 3)
        var roleEmp = new LMSMaster.API.Models.MstEmployeeRole
        {
            EmpId = "TEST002",
            RoleId = 3, // EMP
            IsDefaultRole = "N",
            IsActive = "Y",
            CreatedDate = DateTime.UtcNow,
            CreatedBy = "SYSTEM"
        };
        context.MstEmployeeRoles.Add(roleEmp);
        
        context.SaveChanges();
    }
}

app.Run();
