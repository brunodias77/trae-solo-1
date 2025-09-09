using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetMonthlyStatsQuery : IRequest<List<MonthlyStatsDto>>
{
    public Guid UserId { get; set; }
    public int Year { get; set; } = DateTime.Now.Year;
}

public class GetMonthlyStatsQueryHandler : IRequestHandler<GetMonthlyStatsQuery, List<MonthlyStatsDto>>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<List<MonthlyStatsDto>> Handle(GetMonthlyStatsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}