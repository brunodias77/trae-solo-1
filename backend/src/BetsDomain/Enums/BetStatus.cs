namespace BetsDomain.Enums;

public enum BetStatus
{
    Pending,
    Won,
    Lost,
    Void
}

public static class BetStatusExtensions
{
    public static string ToStringValue(this BetStatus status)
    {
        return status switch
        {
            BetStatus.Pending => "Pending",
            BetStatus.Won => "Won",
            BetStatus.Lost => "Lost",
            BetStatus.Void => "Void",
            _ => "Pending"
        };
    }
    
    public static BetStatus FromString(string status)
    {
        return status?.ToLower() switch
        {
            "pending" => BetStatus.Pending,
            "won" => BetStatus.Won,
            "lost" => BetStatus.Lost,
            "void" => BetStatus.Void,
            _ => BetStatus.Pending
        };
    }
}