namespace TaskManagementApi.Services;

public enum TaskOperationStatus
{
    Success,
    NotFound,
    InvalidTitle
}

public record TaskOperationResult(TaskOperationStatus Status, string? ErrorMessage = null)
{
    public static TaskOperationResult Success()
    {
        return new TaskOperationResult(TaskOperationStatus.Success);
    }

    public static TaskOperationResult NotFound(string message)
    {
        return new TaskOperationResult(TaskOperationStatus.NotFound, message);
    }

    public static TaskOperationResult InvalidTitle(string message)
    {
        return new TaskOperationResult(TaskOperationStatus.InvalidTitle, message);
    }
}

public sealed record TaskOperationResult<T>(
    TaskOperationStatus Status,
    T? Value = default,
    string? ErrorMessage = null)
{
    public static TaskOperationResult<T> Success(T value)
    {
        return new TaskOperationResult<T>(TaskOperationStatus.Success, value);
    }

    public static TaskOperationResult<T> NotFound(string message)
    {
        return new TaskOperationResult<T>(TaskOperationStatus.NotFound, default, message);
    }

    public static TaskOperationResult<T> InvalidTitle(string message)
    {
        return new TaskOperationResult<T>(TaskOperationStatus.InvalidTitle, default, message);
    }
}

