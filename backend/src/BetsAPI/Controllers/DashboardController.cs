using BetsApplication.DTOs;
using BetsApplication.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BetsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(IMediator mediator, ILogger<DashboardController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtém estatísticas gerais do dashboard do usuário
    /// </summary>
    /// <returns>Estatísticas do dashboard</returns>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetDashboardStatsQuery { UserId = userId };
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard stats for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar estatísticas do dashboard");
        }
    }

    /// <summary>
    /// Obtém estatísticas mensais das apostas
    /// </summary>
    /// <param name="year">Ano para filtro (padrão: ano atual)</param>
    /// <returns>Estatísticas mensais</returns>
    [HttpGet("monthly-stats")]
    [ProducesResponseType(typeof(List<MonthlyStatsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMonthlyStats([FromQuery] int? year = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetMonthlyStatsQuery 
            { 
                UserId = userId,
                Year = year ?? DateTime.UtcNow.Year
            };
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting monthly stats for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar estatísticas mensais");
        }
    }

    /// <summary>
    /// Obtém a taxa de vitórias do usuário
    /// </summary>
    /// <param name="startDate">Data inicial para cálculo</param>
    /// <param name="endDate">Data final para cálculo</param>
    /// <returns>Taxa de vitórias em percentual</returns>
    [HttpGet("win-rate")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetWinRate(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetWinRateQuery(userId, startDate, endDate);
            
            var result = await _mediator.Send(query);
            return Ok(new { winRate = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting win rate for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao calcular taxa de vitórias");
        }
    }

    /// <summary>
    /// Obtém o lucro/prejuízo total do usuário
    /// </summary>
    /// <param name="startDate">Data inicial para cálculo</param>
    /// <param name="endDate">Data final para cálculo</param>
    /// <returns>Valor do lucro/prejuízo</returns>
    [HttpGet("profit-loss")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetProfitLoss(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetProfitLossQuery(userId, startDate, endDate);
            
            var result = await _mediator.Send(query);
            return Ok(new { profitLoss = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profit/loss for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao calcular lucro/prejuízo");
        }
    }

    /// <summary>
    /// Obtém a média das odds das apostas do usuário
    /// </summary>
    /// <param name="startDate">Data inicial para cálculo</param>
    /// <param name="endDate">Data final para cálculo</param>
    /// <returns>Média das odds</returns>
    [HttpGet("average-odds")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAverageOdds(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetAverageOddsQuery(userId, startDate, endDate);
            
            var result = await _mediator.Send(query);
            return Ok(new { averageOdds = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting average odds for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao calcular média das odds");
        }
    }

    /// <summary>
    /// Obtém o total de apostas do usuário
    /// </summary>
    /// <param name="startDate">Data inicial para contagem</param>
    /// <param name="endDate">Data final para contagem</param>
    /// <returns>Número total de apostas</returns>
    [HttpGet("total-bets")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetTotalBets(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetTotalBetsQuery(userId, startDate, endDate);
            
            var result = await _mediator.Send(query);
            return Ok(new { totalBets = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total bets for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao contar apostas");
        }
    }

    /// <summary>
    /// Obtém o histórico de performance mensal
    /// </summary>
    /// <param name="months">Número de meses para buscar (padrão: 12)</param>
    /// <returns>Histórico de performance</returns>
    [HttpGet("performance-history")]
    [ProducesResponseType(typeof(List<PerformanceHistoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPerformanceHistory([FromQuery] int months = 12)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetPerformanceHistoryQuery(userId);
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting performance history for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar histórico de performance");
        }
    }

    /// <summary>
    /// Obtém as apostas recentes do usuário
    /// </summary>
    /// <param name="limit">Número máximo de apostas (padrão: 5)</param>
    /// <returns>Lista das apostas mais recentes</returns>
    [HttpGet("recent-bets")]
    [ProducesResponseType(typeof(List<BetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetRecentBets([FromQuery] int limit = 5)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetRecentBetsQuery(userId, Math.Min(limit, 20));
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting recent bets for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar apostas recentes");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Token inválido");
        }
        return userId;
    }
}