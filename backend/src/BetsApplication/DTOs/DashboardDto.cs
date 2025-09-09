namespace BetsApplication.DTOs;

public class DashboardStatsDto
{
    public int TotalBets { get; set; }
    public decimal WinRate { get; set; }
    public decimal TotalStake { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal ROI { get; set; }
    public IEnumerable<MonthlyStatsDto> MonthlyDistribution { get; set; } = new List<MonthlyStatsDto>();
}

public class MonthlyStatsDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public int TotalBets { get; set; }
    public int WonBets { get; set; }
    public int LostBets { get; set; }
    public decimal TotalStake { get; set; }
    public decimal TotalPayout { get; set; }
    public decimal Profit { get; set; }
    public decimal WinRate { get; set; }
}

public class DashboardFiltersDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Status { get; set; }
}

public class PerformanceHistoryDto
{
    public DateTime Date { get; set; }
    public decimal Balance { get; set; }
    public decimal Profit { get; set; }
    public decimal ROI { get; set; }
    public int TotalBets { get; set; }
    public int WonBets { get; set; }
    public decimal WinRate { get; set; }
}