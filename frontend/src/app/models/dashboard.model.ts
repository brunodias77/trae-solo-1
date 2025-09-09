export interface DashboardStats {
  totalBets: number;
  totalAmount: number;
  totalPayout: number;
  totalProfit: number;
  profit: number;
  roi: number;
  winRate: number;
  averageOdds: number;
  monthlyStats: MonthlyStats[];
  recentBets: RecentBet[];
  performanceHistory: PerformanceData[];
}

export interface MonthlyStats {
  month: string;
  year: number;
  totalBets: number;
  totalAmount: number;
  totalPayout: number;
  profit: number;
  winRate: number;
}

export interface RecentBet {
  id: string;
  match: string;
  betType: string;
  odds: number;
  amount: number;
  status: string;
  date: Date;
  profit: number;
  createdAt: Date;
}

export interface PerformanceData {
  date: string;
  profit: number;
  cumulativeProfit: number;
  betsCount: number;
  winRate: number;
}

export interface ProfitLossData {
  period: string;
  profit: number;
  loss: number;
  net: number;
}

export interface WinRateData {
  period: string;
  winRate: number;
  totalBets: number;
  wonBets: number;
}