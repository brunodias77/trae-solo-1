import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bet, CreateBetRequest, UpdateBetRequest, BetFilters, BetStats } from '../models/bet.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BetsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bets`;
  
  getUserBets(filters?: BetFilters, page: number = 1, pageSize: number = 10): Observable<{ bets: Bet[], total: number, page: number, pageSize: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (filters) {
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.betType) {
        params = params.set('betType', filters.betType);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo.toISOString());
      }
      if (filters.minAmount) {
        params = params.set('minAmount', filters.minAmount.toString());
      }
      if (filters.maxAmount) {
        params = params.set('maxAmount', filters.maxAmount.toString());
      }
    }
    
    return this.http.get<{ bets: Bet[], total: number, page: number, pageSize: number }>(
      this.apiUrl, { params }
    );
  }
  
  getBetById(id: string): Observable<Bet> {
    return this.http.get<Bet>(`${this.apiUrl}/${id}`);
  }
  
  createBet(bet: CreateBetRequest): Observable<Bet> {
    // Calculate potential payout
    const betWithPayout = {
      ...bet,
      potentialPayout: this.calculatePayout(bet.amount, bet.odds)
    };
    
    return this.http.post<Bet>(this.apiUrl, betWithPayout);
  }
  
  updateBet(id: string, bet: UpdateBetRequest): Observable<Bet> {
    return this.http.put<Bet>(`${this.apiUrl}/${id}`, bet);
  }
  
  deleteBet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getBetStats(): Observable<BetStats> {
    return this.http.get<BetStats>(`${this.apiUrl}/stats`);
  }
  
  getROI(): Observable<{ roi: number, totalInvested: number, totalReturned: number }> {
    return this.http.get<{ roi: number, totalInvested: number, totalReturned: number }>(
      `${this.apiUrl}/roi`
    );
  }
  
  // Utility methods
  calculatePayout(amount: number, odds: number): number {
    return Math.round((amount * odds) * 100) / 100;
  }
  
  calculateProfit(amount: number, payout: number): number {
    return Math.round((payout - amount) * 100) / 100;
  }
  
  calculateROI(totalInvested: number, totalReturned: number): number {
    if (totalInvested === 0) return 0;
    return Math.round(((totalReturned - totalInvested) / totalInvested * 100) * 100) / 100;
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }
  
  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
}