using BetsApplication.DTOs;
using BetsApplication.Services;
using MediatR;

namespace BetsApplication.Commands.Auth;

public class RegisterCommand : IRequest<AuthResponseDto>
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IAuthService _authService;

    public RegisterCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var registerDto = new RegisterDto
        {
            Name = request.Name,
            Email = request.Email,
            Password = request.Password
        };

        return await _authService.RegisterAsync(registerDto);
    }
}