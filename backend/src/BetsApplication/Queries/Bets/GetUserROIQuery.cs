using MediatR;
using BetsApplication.DTOs;

namespace BetsApplication.Queries.Bets;

public class GetUserROIQuery : IRequest<decimal>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public GetUserROIQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
    }
}

public class GetUserROIQueryHandler : IRequestHandler<GetUserROIQuery, decimal>
{
    public Task<decimal> Handle(GetUserROIQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(0m);
    }
}