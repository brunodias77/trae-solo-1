import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';
import { BetsService } from '../services/bets.service';
import { DashboardStats, RecentBet } from '../models/dashboard.model';
import { CardComponent } from '../shared/card.component';
import { ButtonComponent } from '../shared/button.component';
import { TableComponent, TableColumn } from '../shared/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    TableComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600">Visão geral das suas apostas</p>
        </div>
        <app-button routerLink="/bets/create" variant="primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nova Aposta
        </app-button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Bets -->
        <app-card padding="md" shadow="sm" [hover]="true">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total de Apostas</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats?.totalBets || 0 }}</p>
            </div>
          </div>
        </app-card>

        <!-- Win Rate -->
        <app-card padding="md" shadow="sm" [hover]="true">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Taxa de Acerto</p>
              <p class="text-2xl font-bold text-green-600">{{ formatPercentage(stats?.winRate) }}</p>
            </div>
          </div>
        </app-card>

        <!-- Total Profit -->
        <app-card padding="md" shadow="sm" [hover]="true">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div [class]="getProfitIconClasses()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  @if ((stats?.totalProfit || 0) >= 0) {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                  }
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Lucro Total</p>
              <p class="text-2xl font-bold" [class]="getProfitTextClasses()">
                {{ formatCurrency(stats?.totalProfit) }}
              </p>
            </div>
          </div>
        </app-card>

        <!-- ROI -->
        <app-card padding="md" shadow="sm" [hover]="true">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div [class]="getROIIconClasses()">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">ROI</p>
              <p class="text-2xl font-bold" [class]="getROITextClasses()">
                {{ formatPercentage(stats?.roi) }}
              </p>
            </div>
          </div>
        </app-card>
      </div>

      <!-- Charts and Recent Bets -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Profit Chart -->
        <app-card title="Evolução do Lucro" padding="md" shadow="sm">
          <div class="h-64">
            @if (chartData.length > 0) {
              <svg class="w-full h-full" viewBox="0 0 400 200">
                <!-- Grid lines -->
                <defs>
                  <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <!-- Chart line -->
                <polyline
                  [attr.points]="getChartPoints()"
                  fill="none"
                  [attr.stroke]="getChartColor()"
                  stroke-width="2"
                  class="transition-all duration-300"
                />
                
                <!-- Data points -->
                @for (point of getChartPointsArray(); track $index) {
                  <circle
                    [attr.cx]="point.x"
                    [attr.cy]="point.y"
                    r="4"
                    [attr.fill]="getChartColor()"
                    class="transition-all duration-300 hover:r-6"
                  />
                }
                
                <!-- Zero line -->
                <line
                  x1="0"
                  y1="100"
                  x2="400"
                  y2="100"
                  stroke="#6b7280"
                  stroke-width="1"
                  stroke-dasharray="5,5"
                />
              </svg>
            } @else {
              <div class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p class="text-sm">Nenhum dado disponível</p>
                </div>
              </div>
            }
          </div>
        </app-card>

        <!-- Recent Bets -->
        <app-card title="Apostas Recentes" padding="md" shadow="sm">
          @if (recentBets.length > 0) {
            <div class="space-y-3">
              @for (bet of recentBets; track bet.id) {
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 truncate">{{ bet.match }}</p>
                    <p class="text-sm text-gray-600">{{ bet.betType }} • Odd: {{ bet.odds }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(bet.date) }}</p>
                  </div>
                  <div class="text-right ml-4">
                    <p class="text-sm font-medium" [class]="getBetStatusClasses(bet.status)">
                      {{ getBetStatusLabel(bet.status) }}
                    </p>
                    <p class="text-sm" [class]="getBetAmountClasses(bet.profit)">
                      {{ formatCurrency(bet.profit) }}
                    </p>
                  </div>
                </div>
              }
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200">
              <app-button routerLink="/bets" variant="secondary" size="sm" class="w-full">
                Ver todas as apostas
              </app-button>
            </div>
          } @else {
            <div class="text-center py-8">
              <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p class="text-gray-500 mb-4">Nenhuma aposta encontrada</p>
              <app-button routerLink="/bets/create" variant="primary" size="sm">
                Criar primeira aposta
              </app-button>
            </div>
          }
        </app-card>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  stats: DashboardStats | null = null;
  recentBets: RecentBet[] = [];
  chartData: { date: string; profit: number }[] = [];
  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private betsService: BetsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    // Load dashboard stats
    this.dashboardService.getDashboardStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.isLoading = false;
        }
      });

    // Load recent bets
    this.dashboardService.getRecentBets(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bets) => {
          this.recentBets = bets;
        },
        error: (error) => {
          console.error('Error loading recent bets:', error);
        }
      });

    // Load chart data
    this.dashboardService.getProfitChart(30)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.chartData = data;
        },
        error: (error: any) => {
          console.error('Error loading chart data:', error);
        }
      });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return 'R$ 0,00';
    return this.betsService.formatCurrency(value);
  }

  formatPercentage(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    return `${value.toFixed(1)}%`;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getProfitIconClasses(): string {
    const profit = this.stats?.totalProfit || 0;
    const baseClasses = 'w-8 h-8 rounded-lg flex items-center justify-center';
    
    if (profit >= 0) {
      return `${baseClasses} bg-green-100 text-green-600`;
    }
    return `${baseClasses} bg-red-100 text-red-600`;
  }

  getProfitTextClasses(): string {
    const profit = this.stats?.totalProfit || 0;
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getROIIconClasses(): string {
    const roi = this.stats?.roi || 0;
    const baseClasses = 'w-8 h-8 rounded-lg flex items-center justify-center';
    
    if (roi >= 0) {
      return `${baseClasses} bg-primary-100 text-primary-600`;
    }
    return `${baseClasses} bg-red-100 text-red-600`;
  }

  getROITextClasses(): string {
    const roi = this.stats?.roi || 0;
    return roi >= 0 ? 'text-primary-600' : 'text-red-600';
  }

  getBetStatusClasses(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Ganhou': 'text-green-600',
      'Perdeu': 'text-red-600',
      'Pendente': 'text-yellow-600',
      'Cancelada': 'text-gray-600'
    };
    
    return statusClasses[status] || 'text-gray-600';
  }

  getBetStatusLabel(status: string): string {
    return status;
  }

  getBetAmountClasses(profit: number): string {
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getChartColor(): string {
    const hasProfit = this.chartData.some(d => d.profit > 0);
    return hasProfit ? '#10B981' : '#EF4444';
  }

  getChartPoints(): string {
    if (this.chartData.length === 0) return '';
    
    const maxProfit = Math.max(...this.chartData.map(d => Math.abs(d.profit)));
    const points = this.chartData.map((data, index) => {
      const x = (index / (this.chartData.length - 1)) * 400;
      const y = 100 - (data.profit / maxProfit) * 80; // Center at y=100
      return `${x},${y}`;
    });
    
    return points.join(' ');
  }

  getChartPointsArray(): { x: number; y: number }[] {
    if (this.chartData.length === 0) return [];
    
    const maxProfit = Math.max(...this.chartData.map(d => Math.abs(d.profit)));
    return this.chartData.map((data, index) => {
      const x = (index / (this.chartData.length - 1)) * 400;
      const y = 100 - (data.profit / maxProfit) * 80;
      return { x, y };
    });
  }
}