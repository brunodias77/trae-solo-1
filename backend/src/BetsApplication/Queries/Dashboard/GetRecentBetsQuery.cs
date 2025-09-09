using MediatR;
using BetsApplication.DTOs;

namespace BetsApplication.Queries.Dashboard;

public class GetRecentBetsQuery : IRequest<IEnumerable<BetDto>>
{
    public Guid UserId { get; set; }
    public int Count { get; set; }

    public GetRecentBetsQuery(Guid userId, int count = 10)
    {
        UserId = userId;
        Count = count;
    }
}

public class GetRecentBetsQueryHandler : IRequestHandler<GetRecentBetsQuery, IEnumerable<BetDto>>
{
    public Task<IEnumerable<BetDto>> Handle(GetRecentBetsQuery request, CancellationToken cancellationToken)
    {
        // Implementação será feita posteriormente
        return Task.FromResult(Enumerable.Empty<BetDto>());
    }
}