using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LMSMaster.API.DTOs;
using LMSMaster.API.Repositories;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace LMSMaster.API.Controllers;

[Route("api/employee-role")]
[ApiController]
[Authorize]
public class EmployeeRoleController : ControllerBase
{
    private readonly IAuthRepository _authRepository;

    public EmployeeRoleController(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }

    /// <summary>
    /// Returns all active roles assigned to the logged-in employee.
    /// </summary>
    [HttpGet("my-roles")]
    public async Task<IActionResult> GetMyRoles()
    {
        var empId = User.FindFirstValue("emp_id") ?? User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        if (string.IsNullOrEmpty(empId))
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Unauthorized. Invalid token."));
        }

        var empRoles = await _authRepository.GetEmployeeRolesWithJoinAsync(empId);
        var rolesList = empRoles.Select(er => new RoleDto
        {
            RoleId = er.Role.RoleId,
            RoleCode = er.Role.RoleCode,
            RoleName = er.Role.RoleName,
            IsDefaultRole = er.IsDefaultRole == "Y"
        }).ToList();

        return Ok(ApiResponse<object>.SuccessResponse(rolesList, "Roles retrieved successfully."));
    }
}
