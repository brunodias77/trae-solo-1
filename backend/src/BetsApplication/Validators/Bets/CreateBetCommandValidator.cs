using BetsApplication.Commands.Bets;
using FluentValidation;

namespace BetsApplication.Validators.Bets;

public class CreateBetCommandValidator : AbstractValidator<CreateBetCommand>
{
    public CreateBetCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("ID do usuário é obrigatório");

        RuleFor(x => x.MatchDescription)
            .NotEmpty().WithMessage("Descrição da partida é obrigatória")
            .MinimumLength(5).WithMessage("Descrição deve ter pelo menos 5 caracteres")
            .MaximumLength(500).WithMessage("Descrição deve ter no máximo 500 caracteres");

        RuleFor(x => x.Odds)
            .GreaterThan(1.01m).WithMessage("Odds deve ser maior que 1.01")
            .LessThanOrEqualTo(1000m).WithMessage("Odds deve ser menor ou igual a 1000");

        RuleFor(x => x.Stake)
            .GreaterThan(0).WithMessage("Valor apostado deve ser maior que zero")
            .LessThanOrEqualTo(10000m).WithMessage("Valor apostado deve ser menor ou igual a R$ 10.000");

        RuleFor(x => x.MatchDate)
            .GreaterThan(DateTime.Now.AddMinutes(-30))
            .WithMessage("Data da partida deve ser futura ou no máximo 30 minutos no passado");
    }
}