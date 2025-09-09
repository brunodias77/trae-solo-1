using BetsApplication.Commands.Bets;
using BetsApplication.DTOs;
using BetsApplication.Queries.Bets;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BetsAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BetsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<BetsController> _logger;

    public BetsController(IMediator mediator, ILogger<BetsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Obtém todas as apostas do usuário autenticado
    /// </summary>
    /// <param name="page">Número da página (padrão: 1)</param>
    /// <param name="pageSize">Tamanho da página (padrão: 10)</param>
    /// <param name="status">Filtro por status da aposta</param>
    /// <param name="startDate">Data inicial para filtro</param>
    /// <param name="endDate">Data final para filtro</param>
    /// <returns>Lista paginada de apostas</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<BetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUserBets(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetUserBetsQuery
            {
                UserId = userId,
                Page = page,
                PageSize = pageSize,
                Status = status,
                StartDate = startDate,
                EndDate = endDate
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user bets for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar apostas");
        }
    }

    /// <summary>
    /// Obtém uma aposta específica por ID
    /// </summary>
    /// <param name="id">ID da aposta</param>
    /// <returns>Dados da aposta</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(BetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetBetById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetBetByIdQuery { Id = id, UserId = userId };
            
            var result = await _mediator.Send(query);
            if (result == null)
            {
                return NotFound("Aposta não encontrada");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bet {BetId} for user {UserId}", id, GetCurrentUserId());
            return BadRequest("Erro ao buscar aposta");
        }
    }

    /// <summary>
    /// Cria uma nova aposta
    /// </summary>
    /// <param name="command">Dados da nova aposta</param>
    /// <returns>Aposta criada</returns>
    [HttpPost]
    [ProducesResponseType(typeof(BetDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateBet([FromBody] CreateBetCommand command)
    {
        try
        {
            command.UserId = GetCurrentUserId();
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(
                nameof(GetBetById), 
                new { id = result.Id }, 
                result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bet for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao criar aposta");
        }
    }

    /// <summary>
    /// Atualiza uma aposta existente
    /// </summary>
    /// <param name="id">ID da aposta</param>
    /// <param name="command">Dados atualizados da aposta</param>
    /// <returns>Aposta atualizada</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(BetDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateBet(Guid id, [FromBody] UpdateBetCommand command)
    {
        try
        {
            if (id != command.Id)
            {
                return BadRequest("ID da URL não confere com o ID do corpo da requisição");
            }

            command.UserId = GetCurrentUserId();
            var result = await _mediator.Send(command);
            
            if (result == null)
            {
                return NotFound("Aposta não encontrada");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating bet {BetId} for user {UserId}", id, GetCurrentUserId());
            return BadRequest("Erro ao atualizar aposta");
        }
    }

    /// <summary>
    /// Exclui uma aposta
    /// </summary>
    /// <param name="id">ID da aposta</param>
    /// <returns>Confirmação de exclusão</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteBet(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var command = new DeleteBetCommand { Id = id, UserId = userId };
            
            var result = await _mediator.Send(command);
            if (!result)
            {
                return NotFound("Aposta não encontrada");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting bet {BetId} for user {UserId}", id, GetCurrentUserId());
            return BadRequest("Erro ao excluir aposta");
        }
    }

    /// <summary>
    /// Calcula o ROI das apostas do usuário
    /// </summary>
    /// <param name="startDate">Data inicial para cálculo</param>
    /// <param name="endDate">Data final para cálculo</param>
    /// <returns>Valor do ROI</returns>
    [HttpGet("roi")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetROI(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetUserROIQuery(userId, startDate, endDate);

            var result = await _mediator.Send(query);
            return Ok(new { roi = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calculating ROI for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao calcular ROI");
        }
    }

    /// <summary>
    /// Obtém estatísticas das apostas do usuário
    /// </summary>
    /// <returns>Estatísticas das apostas</returns>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(BetStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetBetStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            var query = new GetBetStatsQuery(userId);
            
            var result = await _mediator.Send(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bet stats for user {UserId}", GetCurrentUserId());
            return BadRequest("Erro ao buscar estatísticas");
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