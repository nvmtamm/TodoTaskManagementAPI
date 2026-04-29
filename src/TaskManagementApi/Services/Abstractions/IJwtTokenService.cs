using TaskManagementApi.Models;

namespace TaskManagementApi.Services.Abstractions;

public interface IJwtTokenService
{
    (string Token, DateTimeOffset ExpiresAt) CreateToken(ApplicationUser user);
}
