using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagementApi.Contracts.Tasks;
using TaskManagementApi.Services;
using TaskManagementApi.Services.Abstractions;

namespace TaskManagementApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] TaskQueryParameters query, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var response = await _taskService.GetTasksAsync(userId, query, cancellationToken);

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTaskById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var task = await _taskService.GetTaskByIdAsync(userId, id, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _taskService.CreateTaskAsync(userId, request, cancellationToken);

        return ToActionResult(result, task => CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTask(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _taskService.UpdateTaskAsync(userId, id, request, cancellationToken);

        return ToActionResult(result, Ok);
    }

    [HttpPatch("{id:guid}/complete")]
    public async Task<IActionResult> MarkTaskComplete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _taskService.SetTaskCompletionAsync(userId, id, true, cancellationToken);

        return ToActionResult(result, Ok);
    }

    [HttpPatch("{id:guid}/incomplete")]
    public async Task<IActionResult> MarkTaskIncomplete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _taskService.SetTaskCompletionAsync(userId, id, false, cancellationToken);

        return ToActionResult(result, Ok);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var result = await _taskService.DeleteTaskAsync(userId, id, cancellationToken);

        return result.Status switch
        {
            TaskOperationStatus.Success => NoContent(),
            TaskOperationStatus.NotFound => NotFound(new { message = result.ErrorMessage }),
            _ => BadRequest(new { message = result.ErrorMessage })
        };
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (!Guid.TryParse(claim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user claim.");
        }

        return userId;
    }

    private IActionResult ToActionResult<T>(TaskOperationResult<T> result, Func<T, IActionResult> onSuccess)
    {
        return result.Status switch
        {
            TaskOperationStatus.Success when result.Value is not null => onSuccess(result.Value),
            TaskOperationStatus.NotFound => NotFound(new { message = result.ErrorMessage }),
            _ => BadRequest(new { message = result.ErrorMessage })
        };
    }
}
