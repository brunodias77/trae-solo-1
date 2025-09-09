using BetsApplication.Commands.Bets;
using FluentValidation;

namespace BetsApplication.Validators.Bets;

public class UpdateBetCommandValidator : AbstractValidator<UpdateBetCommand>
{
    public UpdateBetCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID da aposta é obrigatório");

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

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status é obrigatório")
            .Must(status => new[] { "pending", "won", "lost", "cancelled" }.Contains(status.ToLower()))
            .WithMessage("Status deve ser: pending, won, lost ou cancelled");

        RuleFor(x => x.Payout)
            .GreaterThanOrEqualTo(0).WithMessage("Payout deve ser maior ou igual a zero")
            .LessThanOrEqualTo(100000m).WithMessage("Payout deve ser menor ou igual a R$ 100.000");

        RuleFor(x => x.MatchDate)
            .GreaterThan(DateTime.Now.AddDays(-365))
            .WithMessage("Data da partida não pode ser mais de 1 ano no passado");
    }
}