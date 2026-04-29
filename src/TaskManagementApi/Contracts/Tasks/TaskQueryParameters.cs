namespace TaskManagementApi.Contracts.Tasks;

public class TaskQueryParameters
{
    public string? Search { get; set; }

    public bool? IsCompleted { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
