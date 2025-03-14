using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Services;

namespace UKParliament.CodeTest.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController(IDepartmentService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await service.GetAllDepartmentsAsync();
        return Ok(departments);
    }
}