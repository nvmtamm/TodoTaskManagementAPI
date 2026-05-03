using Microsoft.EntityFrameworkCore;
using TaskManagementApi.Contracts.Tasks;
using TaskManagementApi.Data;
using TaskManagementApi.Models;
using TaskManagementApi.Services.Abstractions;

namespace TaskManagementApi.Services;

public class TaskService : ITaskService
{
    private const int MaxPageSize = 50;
    private const string EmptyTitleMessage = "Task title cannot be empty.";
    private const string NotFoundMessage = "Task not found.";

    private readonly AppDbContext _dbContext;

    public TaskService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PagedResponse<TaskResponse>> GetTasksAsync(
        Guid userId,
        TaskQueryParameters query,
        CancellationToken cancellationToken)
    {
        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, MaxPageSize);

        var taskQuery = ApplyFilters(
            _dbContext.Tasks
                .AsNoTracking()
                .Where(task => task.UserId == userId),
            query);

        var totalCount = await taskQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var tasks = await ApplySorting(taskQuery, query)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResponse<TaskResponse>
        {
            Items = tasks.Select(MapToResponse).ToArray(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = page > 1,
            HasNextPage = page < totalPages
        };
    }

    public async Task<TaskResponse?> GetTaskByIdAsync(
        Guid userId,
        Guid taskId,
        CancellationToken cancellationToken)
    {
        var task = await _dbContext.Tasks
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == taskId && item.UserId == userId, cancellationToken);

        return task is null ? null : MapToResponse(task);
    }

    public async Task<TaskOperationResult<TaskResponse>> CreateTaskAsync(
        Guid userId,
        CreateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var title = NormalizeTitle(request.Title);

        if (title is null)
        {
            return TaskOperationResult<TaskResponse>.InvalidTitle(EmptyTitleMessage);
        }

        var now = DateTimeOffset.UtcNow;
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

        return TaskOperationResult<TaskResponse>.Success(MapToResponse(task));
    }

    public async Task<TaskOperationResult<TaskResponse>> UpdateTaskAsync(
        Guid userId,
        Guid taskId,
        UpdateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var title = NormalizeTitle(request.Title);

        if (title is null)
        {
            return TaskOperationResult<TaskResponse>.InvalidTitle(EmptyTitleMessage);
        }

        var task = await FindUserTaskAsync(userId, taskId, cancellationToken);

        if (task is null)
        {
            return TaskOperationResult<TaskResponse>.NotFound(NotFoundMessage);
        }

        task.Title = title;
        task.Description = NormalizeDescription(request.Description);
        task.UpdatedAt = DateTimeOffset.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return TaskOperationResult<TaskResponse>.Success(MapToResponse(task));
    }

    public async Task<TaskOperationResult<TaskResponse>> SetTaskCompletionAsync(
        Guid userId,
        Guid taskId,
        bool isCompleted,
        CancellationToken cancellationToken)
    {
        var task = await FindUserTaskAsync(userId, taskId, cancellationToken);

        if (task is null)
        {
            return TaskOperationResult<TaskResponse>.NotFound(NotFoundMessage);
        }

        var now = DateTimeOffset.UtcNow;
        task.IsCompleted = isCompleted;
        task.CompletedAt = isCompleted ? now : null;
        task.UpdatedAt = now;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return TaskOperationResult<TaskResponse>.Success(MapToResponse(task));
    }

    public async Task<TaskOperationResult> DeleteTaskAsync(
        Guid userId,
        Guid taskId,
        CancellationToken cancellationToken)
    {
        var task = await FindUserTaskAsync(userId, taskId, cancellationToken);

        if (task is null)
        {
            return TaskOperationResult.NotFound(NotFoundMessage);
        }

        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return TaskOperationResult.Success();
    }

    private Task<TaskItem?> FindUserTaskAsync(Guid userId, Guid taskId, CancellationToken cancellationToken)
    {
        return _dbContext.Tasks
            .SingleOrDefaultAsync(item => item.Id == taskId && item.UserId == userId, cancellationToken);
    }

    private static IQueryable<TaskItem> ApplyFilters(IQueryable<TaskItem> query, TaskQueryParameters parameters)
    {
        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var searchTerm = parameters.Search.Trim().ToLower();
            query = query.Where(task =>
                task.Title.ToLower().Contains(searchTerm) ||
                (task.Description != null && task.Description.ToLower().Contains(searchTerm)));
        }

        if (parameters.IsCompleted.HasValue)
        {
            query = query.Where(task => task.IsCompleted == parameters.IsCompleted.Value);
        }

        return query;
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

