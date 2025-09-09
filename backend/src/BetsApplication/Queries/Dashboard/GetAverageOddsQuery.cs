using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetAverageOddsQuery : IRequest<decimal>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetAverageOddsQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetAverageOddsQueryHandler : IRequestHandler<GetAverageOddsQuery, decimal>
{
    public Task<decimal> Handle(GetAverageOddsQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(0m);
    }
}