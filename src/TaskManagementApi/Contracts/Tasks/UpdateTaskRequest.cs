using System.ComponentModel.DataAnnotations;

namespace TaskManagementApi.Contracts.Tasks;

public class UpdateTaskRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }
}
