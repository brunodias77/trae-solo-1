using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetProfitLossQuery : IRequest<decimal>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetProfitLossQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetProfitLossQueryHandler : IRequestHandler<GetProfitLossQuery, decimal>
{
    public Task<decimal> Handle(GetProfitLossQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(0m);
    }
}