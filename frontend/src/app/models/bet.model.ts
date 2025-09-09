export interface Bet {
  id: string;
  userId: string;
  match: string;
  selection: string;
  betType: BetType;
  odds: number;
  amount: number;
  potentialPayout: number;
  status: BetStatus;
  result?: BetResult;
  profit?: number;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
  settledAt?: Date;
  notes?: string;
}

export enum BetType {
  MATCH_WINNER = 'MATCH_WINNER',
  OVER_UNDER = 'OVER_UNDER',
  BOTH_TEAMS_SCORE = 'BOTH_TEAMS_SCORE',
  HANDICAP = 'HANDICAP',
  CORRECT_SCORE = 'CORRECT_SCORE'
}

export enum BetStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  VOID = 'VOID',
  CASHOUT = 'CASHOUT'
}

export enum BetResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  VOID = 'VOID'
}

export interface CreateBetRequest {
  match: string;
  betType: BetType;
  odds: number;
  amount: number;
  notes?: string;
}

export interface UpdateBetRequest {
  match?: string;
  betType?: BetType;
  odds?: number;
  amount?: number;
  status?: BetStatus;
  result?: BetResult;
  notes?: string;
}

export interface BetFilters {
  status?: BetStatus;
  betType?: BetType;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface BetStats {
  totalBets: number;
  totalAmount: number;
  totalPayout: number;
  winRate: number;
  roi: number;
  profit: number;
  averageOdds: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
}