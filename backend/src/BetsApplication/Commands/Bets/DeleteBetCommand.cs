using MediatR;

namespace BetsApplication.Commands.Bets;

public class DeleteBetCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
}

public class DeleteBetCommandHandler : IRequestHandler<DeleteBetCommand, bool>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<bool> Handle(DeleteBetCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}