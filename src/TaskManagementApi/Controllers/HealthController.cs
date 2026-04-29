using Microsoft.AspNetCore.Mvc;

namespace TaskManagementApi.Controllers;
// This controller provides a simple health check endpoint to verify that the API is running.
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
