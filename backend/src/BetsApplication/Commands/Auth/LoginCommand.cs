using BetsApplication.DTOs;
using MediatR;

namespace BetsApplication.Commands.Auth;

public class LoginCommand : IRequest<AuthResponseDto>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    // Implementation will be added when we create the infrastructure layer
    public Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}