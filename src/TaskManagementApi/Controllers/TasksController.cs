using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Contracts.Tasks;
using TaskManagementApi.Data;
using TaskManagementApi.Models;

namespace TaskManagementApi.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TasksController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks([FromQuery] TaskQueryParameters query, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 50);

        var taskQuery = _dbContext.Tasks
            .AsNoTracking()
            .Where(task => task.UserId == userId);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.Trim().ToLower();
            taskQuery = taskQuery.Where(task =>
                task.Title.ToLower().Contains(searchTerm) ||
                (task.Description != null && task.Description.ToLower().Contains(searchTerm)));
        }

        if (query.IsCompleted.HasValue)
        {
            taskQuery = taskQuery.Where(task => task.IsCompleted == query.IsCompleted.Value);
        }

        var totalCount = await taskQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var tasks = await ApplySorting(taskQuery, query)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var response = new PagedResponse<TaskResponse>
        {
            Items = tasks.Select(MapToResponse).ToArray(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = page > 1,
            HasNextPage = page < totalPages
        };

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTaskById(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var task = await _dbContext.Tasks
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        return Ok(MapToResponse(task));
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var now = DateTimeOffset.UtcNow;
        var title = NormalizeTitle(request.Title);

        if (title is null)
        {
            return BadRequest(new { message = "Task title cannot be empty." });
        }

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Description = NormalizeDescription(request.Description),
            IsCompleted = false,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.Tasks.Add(task);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, MapToResponse(task));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTask(Guid id, UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var title = NormalizeTitle(request.Title);

        if (title is null)
        {
            return BadRequest(new { message = "Task title cannot be empty." });
        }

        var task = await _dbContext.Tasks
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        task.Title = title;
        task.Description = NormalizeDescription(request.Description);
        task.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapToResponse(task));
    }

    [HttpPatch("{id:guid}/complete")]
    public async Task<IActionResult> MarkTaskComplete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var task = await _dbContext.Tasks
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        task.IsCompleted = true;
        task.CompletedAt = DateTimeOffset.UtcNow;
        task.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapToResponse(task));
    }

    [HttpPatch("{id:guid}/incomplete")]
    public async Task<IActionResult> MarkTaskIncomplete(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var task = await _dbContext.Tasks
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        task.IsCompleted = false;
        task.CompletedAt = null;
        task.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(MapToResponse(task));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(Guid id, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        var task = await _dbContext.Tasks
            .SingleOrDefaultAsync(item => item.Id == id && item.UserId == userId, cancellationToken);

        if (task is null)
        {
            return NotFound(new { message = "Task not found." });
        }

        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
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

    private static string? NormalizeTitle(string? title)
    {
        var normalizedTitle = title?.Trim();

        return string.IsNullOrWhiteSpace(normalizedTitle)
            ? null
            : normalizedTitle;
    }

    private static string? NormalizeDescription(string? description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return null;
        }

        return description.Trim();
    }

    private static IQueryable<TaskItem> ApplySorting(IQueryable<TaskItem> query, TaskQueryParameters parameters)
    {
        var descending = !string.Equals(parameters.SortDirection, "asc", StringComparison.OrdinalIgnoreCase);

        return parameters.SortBy?.Trim().ToLowerInvariant() switch
        {
            "title" => descending
                ? query.OrderByDescending(task => task.Title).ThenByDescending(task => task.CreatedAt)
                : query.OrderBy(task => task.Title).ThenByDescending(task => task.CreatedAt),
            "updatedat" => descending
                ? query.OrderByDescending(task => task.UpdatedAt).ThenByDescending(task => task.CreatedAt)
                : query.OrderBy(task => task.UpdatedAt).ThenByDescending(task => task.CreatedAt),
            "completedat" => descending
                ? query.OrderByDescending(task => task.CompletedAt).ThenByDescending(task => task.CreatedAt)
                : query.OrderBy(task => task.CompletedAt).ThenByDescending(task => task.CreatedAt),
            "status" => descending
                ? query.OrderByDescending(task => task.IsCompleted).ThenByDescending(task => task.CreatedAt)
                : query.OrderBy(task => task.IsCompleted).ThenByDescending(task => task.CreatedAt),
            _ => descending
                ? query.OrderByDescending(task => task.CreatedAt)
                : query.OrderBy(task => task.CreatedAt)
        };
    }

    private static TaskResponse MapToResponse(TaskItem task)
    {
        return new TaskResponse
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            IsCompleted = task.IsCompleted,
            CompletedAt = task.CompletedAt,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
    }
}
