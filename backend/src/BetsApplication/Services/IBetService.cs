using BetsApplication.DTOs;
using BetsApplication.Queries.Bets;

namespace BetsApplication.Services;

public interface IBetService
{
    Task<BetDto> CreateBetAsync(CreateBetDto createBetDto, Guid userId);
    Task<BetDto> UpdateBetAsync(Guid id, UpdateBetDto updateBetDto, Guid userId);
    Task<bool> DeleteBetAsync(Guid id, Guid userId);
    Task<BetDto?> GetBetByIdAsync(Guid id, Guid userId);
    Task<PagedResult<BetListDto>> GetUserBetsAsync(Guid userId, int page = 1, int pageSize = 10, 
        string? status = null, DateTime? startDate = null, DateTime? endDate = null, 
        string? sortBy = "CreatedAt", string? sortDirection = "desc");
    Task<decimal> CalculateROIAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<decimal> CalculateTotalPayoutAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
}