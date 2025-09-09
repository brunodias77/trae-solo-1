using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetWinRateQuery : IRequest<decimal>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetWinRateQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetWinRateQueryHandler : IRequestHandler<GetWinRateQuery, decimal>
{
    public Task<decimal> Handle(GetWinRateQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(0m);
    }
}