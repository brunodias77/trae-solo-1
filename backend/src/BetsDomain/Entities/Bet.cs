using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BetsDomain.Entities;

public class Bet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string MatchDescription { get; set; } = string.Empty;
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Odds must be greater than 0")]
    public decimal Odds { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Stake must be greater than 0")]
    public decimal Stake { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending, Won, Lost, Void
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal Payout { get; set; } = 0;
    
    [Required]
    public DateTime MatchDate { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    
    // Calculated properties
    public decimal PotentialPayout => Odds * Stake;
    public decimal Profit => Status == "Won" ? Payout - Stake : (Status == "Lost" ? -Stake : 0);
}