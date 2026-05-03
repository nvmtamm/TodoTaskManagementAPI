using TaskManagementApi.Contracts.Tasks;
using TaskManagementApi.Services;

namespace TaskManagementApi.Services.Abstractions;

public interface ITaskService
{
    Task<PagedResponse<TaskResponse>> GetTasksAsync(
        Guid userId,
        TaskQueryParameters query,
        CancellationToken cancellationToken);

    Task<TaskResponse?> GetTaskByIdAsync(Guid userId, Guid taskId, CancellationToken cancellationToken);

    Task<TaskOperationResult<TaskResponse>> CreateTaskAsync(
        Guid userId,
        CreateTaskRequest request,
        CancellationToken cancellationToken);

    Task<TaskOperationResult<TaskResponse>> UpdateTaskAsync(
        Guid userId,
        Guid taskId,
        UpdateTaskRequest request,
        CancellationToken cancellationToken);

    Task<TaskOperationResult<TaskResponse>> SetTaskCompletionAsync(
        Guid userId,
        Guid taskId,
        bool isCompleted,
        CancellationToken cancellationToken);

    Task<TaskOperationResult> DeleteTaskAsync(Guid userId, Guid taskId, CancellationToken cancellationToken);
}
