using MediatR;
using BetsApplication.DTOs;

namespace BetsApplication.Queries.Dashboard;

public class GetPerformanceHistoryQuery : IRequest<IEnumerable<PerformanceHistoryDto>>
{
    public Guid UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Days { get; set; }

    public GetPerformanceHistoryQuery(Guid userId, DateTime? startDate = null, DateTime? endDate = null, int? days = null)
    {
        UserId = userId;
        StartDate = startDate;
        EndDate = endDate;
        Days = days;
    }
}

public class GetPerformanceHistoryQueryHandler : IRequestHandler<GetPerformanceHistoryQuery, IEnumerable<PerformanceHistoryDto>>
{
    public Task<IEnumerable<PerformanceHistoryDto>> Handle(GetPerformanceHistoryQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(Enumerable.Empty<PerformanceHistoryDto>());
    }
}