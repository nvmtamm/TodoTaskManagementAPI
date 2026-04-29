using Microsoft.AspNetCore.Mvc;

namespace TaskManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok",
            timestamp = DateTimeOffset.UtcNow
        });
    }
}
