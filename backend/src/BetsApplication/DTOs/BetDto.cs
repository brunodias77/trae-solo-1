namespace BetsApplication.DTOs;

public class BetDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string MatchDescription { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Payout { get; set; }
    public DateTime MatchDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal PotentialPayout { get; set; }
    public decimal Profit { get; set; }
}

public class CreateBetDto
{
    public string MatchDescription { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public DateTime MatchDate { get; set; }
}

public class UpdateBetDto
{
    public Guid Id { get; set; }
    public string MatchDescription { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Payout { get; set; }
    public DateTime MatchDate { get; set; }
}

public class BetListDto
{
    public IEnumerable<BetDto> Bets { get; set; } = new List<BetDto>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

public class PagedResultDto<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

public class BetStatsDto
{
    public int TotalBets { get; set; }
    public int WonBets { get; set; }
    public int LostBets { get; set; }
    public int PendingBets { get; set; }
    public decimal WinRate { get; set; }
    public decimal TotalStake { get; set; }
    public decimal TotalPayout { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal ROI { get; set; }
    public decimal AverageOdds { get; set; }
    public decimal AverageStake { get; set; }
}