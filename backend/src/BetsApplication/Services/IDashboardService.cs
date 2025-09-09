using BetsApplication.DTOs;

namespace BetsApplication.Services;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<List<MonthlyStatsDto>> GetMonthlyStatsAsync(Guid userId, int year = 0);
    Task<decimal> GetWinRateAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<decimal> GetAverageOddsAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<decimal> GetProfitLossAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
    Task<int> GetTotalBetsCountAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null);
}