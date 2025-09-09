using BetsDomain.Entities;
using BetsDomain.Interfaces;
using BetsInfrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BetsInfrastructure.Repositories;

public class BetRepository : IBetRepository
{
    private readonly BetsDbContext _context;

    public BetRepository(BetsDbContext context)
    {
        _context = context;
    }

    public async Task<Bet?> GetByIdAsync(Guid id)
    {
        return await _context.Bets
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Bet>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Bets
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Bet>> GetByUserIdWithPaginationAsync(Guid userId, int page, int pageSize)
    {
        return await _context.Bets
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Bet>> GetRecentByUserIdAsync(Guid userId, int count = 10)
    {
        return await _context.Bets
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Bet> CreateAsync(Bet bet)
    {
        _context.Bets.Add(bet);
        await _context.SaveChangesAsync();
        return bet;
    }

    public async Task<Bet> UpdateAsync(Bet bet)
    {
        bet.UpdatedAt = DateTime.UtcNow;
        _context.Bets.Update(bet);
        await _context.SaveChangesAsync();
        return bet;
    }

    public async Task DeleteAsync(Guid id)
    {
        var bet = await _context.Bets.FindAsync(id);
        if (bet != null)
        {
            _context.Bets.Remove(bet);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Bets.AnyAsync(b => b.Id == id);
    }

    public async Task<int> GetTotalCountByUserIdAsync(Guid userId)
    {
        return await _context.Bets.CountAsync(b => b.UserId == userId);
    }

    public async Task<IEnumerable<Bet>> GetByUserIdAndStatusAsync(Guid userId, string status)
    {
        return await _context.Bets
            .Where(b => b.UserId == userId && b.Status.ToLower() == status.ToLower())
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Bet>> GetByUserIdAndDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        return await _context.Bets
            .Where(b => b.UserId == userId && b.MatchDate >= startDate && b.MatchDate <= endDate)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Bet>> GetFilteredAsync(Guid userId, string? status = null, 
        DateTime? startDate = null, DateTime? endDate = null, int skip = 0, int take = 10, 
        string sortBy = "CreatedAt", string sortDirection = "desc")
    {
        var query = _context.Bets.Where(b => b.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(b => b.Status.ToLower() == status.ToLower());

        if (startDate.HasValue)
            query = query.Where(b => b.MatchDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(b => b.MatchDate <= endDate.Value);

        // Apply sorting
        query = sortBy.ToLower() switch
        {
            "matchdate" => sortDirection.ToLower() == "asc" 
                ? query.OrderBy(b => b.MatchDate) 
                : query.OrderByDescending(b => b.MatchDate),
            "odds" => sortDirection.ToLower() == "asc" 
                ? query.OrderBy(b => b.Odds) 
                : query.OrderByDescending(b => b.Odds),
            "stake" => sortDirection.ToLower() == "asc" 
                ? query.OrderBy(b => b.Stake) 
                : query.OrderByDescending(b => b.Stake),
            "payout" => sortDirection.ToLower() == "asc" 
                ? query.OrderBy(b => b.Payout) 
                : query.OrderByDescending(b => b.Payout),
            _ => sortDirection.ToLower() == "asc" 
                ? query.OrderBy(b => b.CreatedAt) 
                : query.OrderByDescending(b => b.CreatedAt)
        };

        return await query.Skip(skip).Take(take).ToListAsync();
    }

    public async Task<int> GetCountAsync(Guid userId, string? status = null, 
        DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Bets.Where(b => b.UserId == userId);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(b => b.Status.ToLower() == status.ToLower());

        if (startDate.HasValue)
            query = query.Where(b => b.MatchDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(b => b.MatchDate <= endDate.Value);

        return await query.CountAsync();
    }

    public async Task<decimal> GetTotalStakeAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Bets.Where(b => b.UserId == userId);

        if (startDate.HasValue)
            query = query.Where(b => b.MatchDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(b => b.MatchDate <= endDate.Value);

        return await query.SumAsync(b => b.Stake);
    }

    public async Task<decimal> GetTotalPayoutAsync(Guid userId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _context.Bets.Where(b => b.UserId == userId && b.Status.ToLower() == "won");

        if (startDate.HasValue)
            query = query.Where(b => b.MatchDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(b => b.MatchDate <= endDate.Value);

        return await query.SumAsync(b => b.Payout);
    }
}