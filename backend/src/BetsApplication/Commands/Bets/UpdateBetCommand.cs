using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Commands.Bets;

public class UpdateBetCommand : IRequest<BetDto>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string MatchDescription { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Payout { get; set; }
    public DateTime MatchDate { get; set; }
}

public class UpdateBetCommandHandler : IRequestHandler<UpdateBetCommand, BetDto>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<BetDto> Handle(UpdateBetCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}