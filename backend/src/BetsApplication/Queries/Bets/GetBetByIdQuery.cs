using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Queries.Bets;

public class GetBetByIdQuery : IRequest<BetDto?>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class GetBetByIdQueryHandler : IRequestHandler<GetBetByIdQuery, BetDto?>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<BetDto?> Handle(GetBetByIdQuery request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}