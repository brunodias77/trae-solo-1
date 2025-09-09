import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats, MonthlyStats, RecentBet, PerformanceData, ProfitLossData, WinRateData } from '../models/dashboard.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;
  
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
  
  getMonthlyStats(year?: number): Observable<MonthlyStats[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    
    return this.http.get<MonthlyStats[]>(`${this.apiUrl}/monthly`, { params });
  }
  
  getWinRate(period?: string): Observable<WinRateData[]> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    
    return this.http.get<WinRateData[]>(`${this.apiUrl}/winrate`, { params });
  }
  
  getProfitLoss(period?: string): Observable<ProfitLossData[]> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    
    return this.http.get<ProfitLossData[]>(`${this.apiUrl}/profit-loss`, { params });
  }
  
  getAverageOdds(): Observable<{ averageOdds: number, totalBets: number }> {
    return this.http.get<{ averageOdds: number, totalBets: number }>(`${this.apiUrl}/average-odds`);
  }
  
  getTotalBets(): Observable<{ totalBets: number, pendingBets: number, settledBets: number }> {
    return this.http.get<{ totalBets: number, pendingBets: number, settledBets: number }>(`${this.apiUrl}/total-bets`);
  }
  
  getPerformanceHistory(days: number = 30): Observable<PerformanceData[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<PerformanceData[]>(`${this.apiUrl}/performance`, { params });
  }
  
  getRecentBets(limit: number = 5): Observable<RecentBet[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<RecentBet[]>(`${this.apiUrl}/recent-bets`, { params });
  }
  
  getProfitChart(days: number = 30): Observable<any> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<any>(`${this.apiUrl}/profit-chart`, { params });
  }
  
  // Utility methods for data formatting
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }
  
  formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
  
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'won':
        return 'text-primary-600';
      case 'lost':
        return 'text-danger-600';
      case 'pending':
        return 'text-yellow-600';
      case 'void':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }
  
  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'won':
        return 'badge-success';
      case 'lost':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      case 'void':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  }
  
  getProfitColor(profit: number): string {
    if (profit > 0) return 'text-primary-600';
    if (profit < 0) return 'text-danger-600';
    return 'text-gray-600';
  }
  
  calculateWinRate(wonBets: number, totalBets: number): number {
    if (totalBets === 0) return 0;
    return Math.round((wonBets / totalBets * 100) * 100) / 100;
  }
  
  calculateROI(totalInvested: number, totalReturned: number): number {
    if (totalInvested === 0) return 0;
    return Math.round(((totalReturned - totalInvested) / totalInvested * 100) * 100) / 100;
  }
}