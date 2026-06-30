using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMSMaster.API.DTOs;
using System.Security.Claims;

namespace LMSMaster.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DashboardController : ControllerBase
{
    [HttpGet]
    public IActionResult GetDashboardData()
    {
        var roleCode = User.FindFirstValue("role_code") ?? string.Empty;
        var empName = User.FindFirstValue("emp_name") ?? "User";

        switch (roleCode)
        {
            case "ADM":
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    DashboardType = "Admin",
                    Message = $"Welcome {empName} to the Admin Dashboard.",
                    Stats = new { TotalEmployees = 4, PendingApprovals = 1 }
                }));

            case "RM":
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    DashboardType = "Reporting Manager",
                    Message = $"Welcome {empName} to the Reporting Manager Dashboard.",
                    Stats = new { DirectReports = 2, PendingLeaveApprovals = 1 }
                }));

            case "EMP":
            default:
                return Ok(ApiResponse<object>.SuccessResponse(new
                {
                    DashboardType = "Employee",
                    Message = $"Welcome {empName} to the Employee Dashboard.",
                    Stats = new { AppliedLeaves = 2, RemainingBalance = 18 }
                }));
        }
    }
}
