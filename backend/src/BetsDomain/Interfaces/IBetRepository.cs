using BetsDomain.Entities;

namespace BetsDomain.Interfaces;

public interface IBetRepository
{
    Task<Bet?> GetByIdAsync(Guid id);
    Task<IEnumerable<Bet>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Bet>> GetByUserIdWithPaginationAsync(Guid userId, int page, int pageSize);
    Task<IEnumerable<Bet>> GetRecentByUserIdAsync(Guid userId, int count = 10);
    Task<Bet> CreateAsync(Bet bet);
    Task<Bet> UpdateAsync(Bet bet);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetTotalCountByUserIdAsync(Guid userId);
    Task<IEnumerable<Bet>> GetByUserIdAndStatusAsync(Guid userId, string status);
    Task<IEnumerable<Bet>> GetByUserIdAndDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate);
}