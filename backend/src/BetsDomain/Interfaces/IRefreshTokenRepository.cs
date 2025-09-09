using BetsDomain.Entities;

namespace BetsDomain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task<RefreshToken?> GetByUserIdAsync(Guid userId);
    Task<RefreshToken> CreateAsync(RefreshToken refreshToken);
    Task<RefreshToken> UpdateAsync(RefreshToken refreshToken);
    Task DeleteAsync(Guid id);
    Task DeleteByUserIdAsync(Guid userId);
    Task RevokeAllByUserIdAsync(Guid userId);
    Task<bool> ExistsAsync(Guid id);
    Task CleanupExpiredTokensAsync();
}