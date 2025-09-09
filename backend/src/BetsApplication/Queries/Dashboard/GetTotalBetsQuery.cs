using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetTotalBetsQuery : IRequest<int>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetTotalBetsQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetTotalBetsQueryHandler : IRequestHandler<GetTotalBetsQuery, int>
{
    public Task<int> Handle(GetTotalBetsQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(0);
    }
}