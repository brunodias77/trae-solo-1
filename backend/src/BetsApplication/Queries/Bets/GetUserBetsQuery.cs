using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Queries.Bets;

public class GetUserBetsQuery : IRequest<PagedResult<BetListDto>>
{
    public Guid UserId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Status { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortDirection { get; set; } = "desc";
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class GetUserBetsQueryHandler : IRequestHandler<GetUserBetsQuery, PagedResult<BetListDto>>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<PagedResult<BetListDto>> Handle(GetUserBetsQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}