using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Commands.Bets;

public class CreateBetCommand : IRequest<BetDto>
{
    public Guid UserId { get; set; }
    public string MatchDescription { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public DateTime MatchDate { get; set; }
}

public class CreateBetCommandHandler : IRequestHandler<CreateBetCommand, BetDto>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<BetDto> Handle(CreateBetCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}