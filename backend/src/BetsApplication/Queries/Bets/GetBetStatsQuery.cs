using MediatR;
using BetsApplication.DTOs;

namespace BetsApplication.Queries.Bets;

public class GetBetStatsQuery : IRequest<BetStatsDto>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetBetStatsQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetBetStatsQueryHandler : IRequestHandler<GetBetStatsQuery, BetStatsDto>
{
    public Task<BetStatsDto> Handle(GetBetStatsQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(new BetStatsDto());
    }
}