namespace TaskManagementApi.Contracts.Tasks;

public class TaskQueryParameters
{
    public string? Search { get; set; }

    public bool? IsCompleted { get; set; }

    public string? SortBy { get; set; } = "createdAt";

    public string? SortDirection { get; set; } = "desc";

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}
