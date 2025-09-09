using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Queries.Dashboard;

public class GetDashboardStatsQuery : IRequest<DashboardStatsDto>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<DashboardStatsDto> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}