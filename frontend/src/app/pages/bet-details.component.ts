import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Bet, BetStatus } from '../models/bet.model';
import { BetsService } from '../services/bets.service';
import { CardComponent } from '../shared/card.component';
import { ButtonComponent } from '../shared/button.component';
import { ModalComponent } from '../shared/modal.component';

@Component({
  selector: 'app-bet-details',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    ModalComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      @if (isLoading) {
        <!-- Loading State -->
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (bet) {
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">{{ bet.match }}</h1>
              <span class="px-3 py-1 rounded-full text-sm font-medium"
                    [class]="getStatusClasses(bet.status)">
                {{ getStatusLabel(bet.status) }}
              </span>
            </div>
            <p class="text-gray-600 mt-1">
              {{ bet.match || 'Partida não informada' }} • {{ formatDate(bet.createdAt) }}
            </p>
          </div>
          
          <div class="flex items-center space-x-3">
            <app-button
              variant="secondary"
              (click)="goBack()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Voltar
            </app-button>
            
            @if (bet.status === BetStatus.PENDING) {
              <app-button
                variant="primary"
                (click)="editBet()"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Editar
              </app-button>
            }
            
            <app-button
              variant="danger"
              (click)="openDeleteModal()"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Excluir
            </app-button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column - Bet Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Match Information -->
            <app-card title="Informações do Jogo" padding="lg" shadow="sm">
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Jogo</label>
                    <p class="text-gray-900 font-semibold">{{ bet.match }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Partida</label>
                    <p class="text-gray-900">{{ bet.match }}</p>
                  </div>
                  
                  @if (bet.date) {
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Data do Jogo</label>
                      <p class="text-gray-900">{{ formatDateTime(bet.date) }}</p>
                    </div>
                  }
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Aposta</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ bet.betType }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Seleção</label>
                  <p class="text-gray-900 font-semibold">{{ bet.selection }}</p>
                </div>
                
                @if (bet.notes) {
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ bet.notes }}</p>
                  </div>
                }
              </div>
            </app-card>

            @if (bet.notes) {
              <app-card title="Observações" padding="lg" shadow="sm">
                <p class="text-gray-700">{{ bet.notes }}</p>
              </app-card>
            }

            <!-- Timeline -->
            <app-card title="Histórico" padding="lg" shadow="sm">
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Aposta criada</p>
                    <p class="text-sm text-gray-600">{{ formatDateTime(bet.createdAt) }}</p>
                  </div>
                </div>
                
                @if (bet.status !== BetStatus.PENDING) {
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                         [class.bg-green-500]="bet.status === BetStatus.WON"
                         [class.bg-red-500]="bet.status === BetStatus.LOST"
                         [class.bg-gray-500]="bet.status === BetStatus.VOID">
                    </div>
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">
                        Aposta {{ bet.status.toLowerCase() }}
                      </p>
                      <p class="text-sm text-gray-600">{{ formatDateTime(bet.updatedAt) }}</p>
                    </div>
                  </div>
                }
              </div>
            </app-card>
          </div>

          <!-- Right Column - Financial Summary -->
          <div class="space-y-6">
            <!-- Financial Details -->
            <app-card title="Resumo Financeiro" padding="lg" shadow="sm">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Valor Apostado:</span>
                  <span class="font-semibold text-gray-900">{{ formatCurrency(bet.amount) }}</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Odd:</span>
                  <span class="font-semibold text-gray-900">{{ bet.odds.toFixed(2) }}</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Retorno Potencial:</span>
                  <span class="font-semibold text-primary-600">{{ formatCurrency(bet.potentialPayout) }}</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Lucro Potencial:</span>
                  <span class="font-semibold text-green-600">{{ formatCurrency(bet.potentialPayout - bet.amount) }}</span>
                </div>
                
                <hr class="my-4">
                
                @if (bet.status === BetStatus.WON) {
                  <div class="bg-green-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-green-800">Lucro Obtido:</span>
                      <span class="font-bold text-green-600">{{ formatCurrency(bet.profit || 0) }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-green-800">Retorno Total:</span>
                      <span class="font-bold text-green-600">{{ formatCurrency((bet.profit || 0) + bet.amount) }}</span>
                    </div>
                  </div>
                } @else if (bet.status === BetStatus.LOST) {
                  <div class="bg-red-50 p-4 rounded-lg">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-red-800">Perda:</span>
                      <span class="font-bold text-red-600">-{{ formatCurrency(bet.amount) }}</span>
                    </div>
                  </div>
                } @else {
                  <div class="bg-yellow-50 p-4 rounded-lg">
                    <p class="text-sm text-yellow-800 text-center">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Aguardando resultado
                    </p>
                  </div>
                }
              </div>
            </app-card>

            <!-- Quick Actions -->
            @if (bet.status === BetStatus.PENDING) {
              <app-card title="Ações Rápidas" padding="lg" shadow="sm">
                <div class="space-y-3">
                  <app-button
                    variant="primary"
                    size="sm"
                    class="w-full"
                    (click)="markAsWon()"
                    [disabled]="isUpdating"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Marcar como Ganha
                  </app-button>
                  
                  <app-button
                    variant="danger"
                    size="sm"
                    class="w-full"
                    (click)="markAsLost()"
                    [disabled]="isUpdating"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Marcar como Perdida
                  </app-button>
                  
                  <app-button
                    variant="secondary"
                    size="sm"
                    class="w-full"
                    (click)="markAsCancelled()"
                    [disabled]="isUpdating"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                    </svg>
                    Cancelar Aposta
                  </app-button>
                </div>
              </app-card>
            }

            <!-- Statistics -->
            <app-card title="Estatísticas" padding="lg" shadow="sm">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">ROI Potencial:</span>
                  <span class="font-semibold" [class.text-green-600]="calculateROI() > 0" [class.text-red-600]="calculateROI() < 0">
                    {{ calculateROI().toFixed(2) }}%
                  </span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Multiplicador:</span>
                  <span class="font-semibold text-gray-900">{{ bet.odds.toFixed(2) }}x</span>
                </div>
                
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Probabilidade Implícita:</span>
                  <span class="font-semibold text-gray-900">{{ calculateImpliedProbability().toFixed(1) }}%</span>
                </div>
              </div>
            </app-card>
          </div>
        </div>
      } @else {
        <!-- Error State -->
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aposta não encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">A aposta que você está procurando não existe ou foi removida.</p>
          <div class="mt-6">
            <app-button variant="primary" (click)="goBack()">
              Voltar para Lista
            </app-button>
          </div>
        </div>
      }
    </div>

    <!-- Delete Confirmation Modal -->
    <app-modal
      [(isOpen)]="showDeleteModal"
      title="Confirmar Exclusão"
      size="sm"
    >
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Excluir Aposta</h3>
        <p class="text-sm text-gray-600 mb-6">
          Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita.
        </p>
        <div class="flex items-center justify-center space-x-3">
          <app-button
            variant="secondary"
            (click)="closeDeleteModal()"
            [disabled]="isDeleting"
          >
            Cancelar
          </app-button>
          <app-button
            variant="danger"
            (click)="confirmDelete()"
            [disabled]="isDeleting"
            [loading]="isDeleting"
          >
            Excluir
          </app-button>
        </div>
      </div>
    </app-modal>
  `
})
export class BetDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  bet: Bet | null = null;
  isLoading = true;
  isUpdating = false;
  isDeleting = false;
  showDeleteModal = false;
  betId: string | null = null;
  
  // Expose enum to template
  BetStatus = BetStatus;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private betsService: BetsService
  ) {}

  ngOnInit(): void {
    this.betId = this.route.snapshot.paramMap.get('id');
    if (this.betId) {
      this.loadBet(this.betId);
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBet(id: string): void {
    this.isLoading = true;
    
    this.betsService.getBetById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bet) => {
          this.bet = bet;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bet:', error);
          this.bet = null;
          this.isLoading = false;
        }
      });
  }

  editBet(): void {
    if (this.betId) {
      this.router.navigate(['/bets/edit', this.betId]);
    }
  }

  markAsWon(): void {
    this.updateBetStatus(BetStatus.WON);
  }

  markAsLost(): void {
    this.updateBetStatus(BetStatus.LOST);
  }

  markAsCancelled(): void {
    this.updateBetStatus(BetStatus.VOID);
  }

  private updateBetStatus(status: BetStatus): void {
    if (!this.bet || !this.betId) return;
    
    this.isUpdating = true;
    
    const updateData = {
      ...this.bet,
      status,
      profit: status === BetStatus.WON ? this.bet.potentialPayout - this.bet.amount : (status === BetStatus.LOST ? -this.bet.amount : 0)
    };
    
    this.betsService.updateBet(this.betId, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedBet) => {
          this.bet = updatedBet;
          this.isUpdating = false;
          const statusLabel = this.getStatusLabel(status);
          alert(`Aposta marcada como ${statusLabel.toLowerCase()}!`);
        },
        error: (error) => {
          console.error('Error updating bet status:', error);
          this.isUpdating = false;
          alert('Erro ao atualizar status da aposta');
        }
      });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.betId) return;
    
    this.isDeleting = true;
    
    this.betsService.deleteBet(this.betId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.showDeleteModal = false;
          alert('Aposta excluída com sucesso!');
          this.router.navigate(['/bets']);
        },
        error: (error) => {
          console.error('Error deleting bet:', error);
          this.isDeleting = false;
          alert('Erro ao excluir aposta');
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/bets']);
  }

  getStatusLabel(status: BetStatus): string {
    const labels: Record<BetStatus, string> = {
      [BetStatus.PENDING]: 'Pendente',
      [BetStatus.WON]: 'Ganha',
      [BetStatus.LOST]: 'Perdida',
      [BetStatus.VOID]: 'Cancelada',
      [BetStatus.CASHOUT]: 'Cashout'
    };
    return labels[status] || status;
  }

  getStatusClasses(status: BetStatus): string {
    const classes: Record<BetStatus, string> = {
      [BetStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [BetStatus.WON]: 'bg-green-100 text-green-800',
      [BetStatus.LOST]: 'bg-red-100 text-red-800',
      [BetStatus.VOID]: 'bg-gray-100 text-gray-800',
      [BetStatus.CASHOUT]: 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  calculateROI(): number {
    if (!this.bet) return 0;
    return (((this.bet.potentialPayout - this.bet.amount) / this.bet.amount) * 100);
  }

  calculateImpliedProbability(): number {
    if (!this.bet) return 0;
    return (1 / this.bet.odds) * 100;
  }

  formatCurrency(value: number): string {
    return this.betsService.formatCurrency(value);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}