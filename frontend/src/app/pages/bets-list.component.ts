import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { BetsService } from '../services/bets.service';
import { Bet, BetStatus, BetResult, BetType } from '../models/bet.model';
import { CardComponent } from '../shared/card.component';
import { InputComponent } from '../shared/input.component';
import { ButtonComponent } from '../shared/button.component';
import { TableComponent, TableColumn, TableAction } from '../shared/table.component';
import { ModalComponent } from '../shared/modal.component';

interface BetFilters {
  search: string;
  status: BetStatus | 'all';
  type: BetType | 'all';
  dateFrom: string;
  dateTo: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

@Component({
  selector: 'app-bets-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    InputComponent,
    ButtonComponent,
    TableComponent,
    ModalComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Minhas Apostas</h1>
          <p class="text-gray-600">Gerencie e acompanhe suas apostas</p>
        </div>
        <app-button routerLink="/bets/create" variant="primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nova Aposta
        </app-button>
      </div>

      <!-- Filters -->
      <app-card padding="md" shadow="sm">
        <form [formGroup]="filtersForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Search -->
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <app-input
                formControlName="search"
                placeholder="Buscar por jogo, time..."
                
              ></app-input>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                formControlName="status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="all">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Ganhou">Ganhou</option>
                <option value="Perdeu">Perdeu</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>

            <!-- Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                formControlName="type"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="all">Todos</option>
                <option value="Simples">Simples</option>
                <option value="Múltipla">Múltipla</option>
                <option value="Sistema">Sistema</option>
              </select>
            </div>

            <!-- Actions -->
            <div class="flex items-end space-x-2">
              <app-button
                type="button"
                variant="secondary"
                size="sm"
                (click)="clearFilters()"
                class="flex-1"
              >
                Limpar
              </app-button>
            </div>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <app-input
                formControlName="dateFrom"
                type="date"
              ></app-input>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <app-input
                formControlName="dateTo"
                type="date"
              ></app-input>
            </div>
          </div>
        </form>
      </app-card>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <app-card padding="md" shadow="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ filteredStats.total }}</p>
            <p class="text-sm text-gray-600">Total</p>
          </div>
        </app-card>
        
        <app-card padding="md" shadow="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ filteredStats.won }}</p>
            <p class="text-sm text-gray-600">Ganhas</p>
          </div>
        </app-card>
        
        <app-card padding="md" shadow="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-red-600">{{ filteredStats.lost }}</p>
            <p class="text-sm text-gray-600">Perdidas</p>
          </div>
        </app-card>
        
        <app-card padding="md" shadow="sm">
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-600">{{ filteredStats.pending }}</p>
            <p class="text-sm text-gray-600">Pendentes</p>
          </div>
        </app-card>
      </div>

      <!-- Bets Table -->
      <app-card padding="none" shadow="sm">
        @if (isLoading) {
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span class="ml-3 text-gray-600">Carregando apostas...</span>
          </div>
        } @else if (bets.length === 0) {
          <div class="text-center py-12">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p class="text-gray-500 mb-4">Nenhuma aposta encontrada</p>
            <app-button routerLink="/bets/create" variant="primary" size="sm">
              Criar primeira aposta
            </app-button>
          </div>
        } @else {
          <app-table
            [columns]="tableColumns"
            [data]="bets"
            [actions]="tableActions"
            (sortChange)="onSortChange($event)"
          ></app-table>
        }
      </app-card>

      <!-- Pagination -->
      @if (pagination.totalPages > 1) {
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ getItemsRange() }} de {{ pagination.totalItems }} resultados
          </div>
          
          <div class="flex items-center space-x-2">
            <app-button
              variant="secondary"
              size="sm"
              [disabled]="pagination.currentPage === 1"
              (click)="goToPage(pagination.currentPage - 1)"
            >
              Anterior
            </app-button>
            
            @for (page of getVisiblePages(); track page) {
              <app-button
                [variant]="page === pagination.currentPage ? 'primary' : 'secondary'"
                size="sm"
                (click)="goToPage(page)"
              >
                {{ page }}
              </app-button>
            }
            
            <app-button
              variant="secondary"
              size="sm"
              [disabled]="pagination.currentPage === pagination.totalPages"
              (click)="goToPage(pagination.currentPage + 1)"
            >
              Próxima
            </app-button>
          </div>
        </div>
      }
    </div>

    <!-- Delete Confirmation Modal -->
    <app-modal
      [(isOpen)]="showDeleteModal"
      title="Excluir Aposta"
      size="md"
    >
      <div class="space-y-4">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Atenção!</h3>
              <p class="mt-1 text-sm text-red-700">
                Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
        </div>

        @if (betToDelete) {
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900 mb-2">{{ betToDelete.match }}</h4>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Tipo:</strong> {{ betToDelete.betType }}</p>
              <p><strong>Valor:</strong> {{ formatCurrency(betToDelete.amount) }}</p>
              <p><strong>Odd:</strong> {{ betToDelete.odds }}</p>
              <p><strong>Status:</strong> {{ betToDelete.status }}</p>
            </div>
          </div>
        }

        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <app-button
            type="button"
            variant="secondary"
            (click)="closeDeleteModal()"
            [disabled]="isDeleting"
          >
            Cancelar
          </app-button>
          
          <app-button
            type="button"
            variant="danger"
            [loading]="isDeleting"
            (click)="confirmDelete()"
          >
            Excluir Aposta
          </app-button>
        </div>
      </div>
    </app-modal>
  `
})
export class BetsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  filtersForm: FormGroup;
  bets: Bet[] = [];
  filteredStats = { total: 0, won: 0, lost: 0, pending: 0 };
  
  pagination: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };
  
  isLoading = false;
  isDeleting = false;
  showDeleteModal = false;
  betToDelete: Bet | null = null;
  
  tableColumns: TableColumn[] = [
    {
      key: 'match',
      label: 'Jogo',
      sortable: true,
      width: '25%'
    },
    {
      key: 'betType',
      label: 'Tipo',
      sortable: true,
      width: '15%'
    },
    {
      key: 'amount',
      label: 'Valor',
      sortable: true,
      width: '15%',
      type: 'currency'
    },
    {
      key: 'odds',
      label: 'Odd',
      sortable: true,
      width: '10%'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '15%',
      type: 'badge'
    },
    {
      key: 'profit',
      label: 'Resultado',
      sortable: true,
      width: '15%',
      type: 'currency'
    },
    {
      key: 'date',
      label: 'Data',
      sortable: true,
      width: '10%',
      type: 'date'
    }
  ];
  
  tableActions: TableAction[] = [
    {
      label: 'Ver',
      icon: 'eye',
      action: (item: Bet) => console.log('View bet:', item.id),
      variant: 'secondary'
    },
    {
      label: 'Editar',
      icon: 'edit',
      action: (item: Bet) => console.log('Edit bet:', item.id),
      variant: 'primary',
      // condition: (item: Bet) => item.status === BetStatus.PENDING
    },
    {
      label: 'Excluir',
      icon: 'trash',
      action: (item: Bet) => this.openDeleteModal(item),
      variant: 'danger'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private betsService: BetsService
  ) {
    this.filtersForm = this.createFiltersForm();
  }

  ngOnInit(): void {
    this.setupFiltersSubscription();
    this.loadBets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createFiltersForm(): FormGroup {
    return this.fb.group({
      search: [''],
      status: ['all'],
      type: ['all'],
      dateFrom: [''],
      dateTo: ['']
    });
  }

  private setupFiltersSubscription(): void {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.currentPage = 1;
        this.loadBets();
      });
  }

  private loadBets(): void {
    this.isLoading = true;
    
    const filters = this.filtersForm.value;
    const params = {
      page: this.pagination.currentPage,
      limit: this.pagination.itemsPerPage,
      ...filters
    };
    
    // Mock API call - replace with actual service
    setTimeout(() => {
      const mockBets: Bet[] = [
        {
          id: '1',
          userId: 'user1',
          match: 'Flamengo vs Palmeiras',
          betType: BetType.MATCH_WINNER,
          selection: 'Flamengo Vitória',
          odds: 2.5,
          amount: 100,
          potentialPayout: 250,
          status: BetStatus.WON,
          result: BetResult.WIN,
          profit: 150,
          date: new Date('2024-01-15'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          settledAt: new Date('2024-01-15')
        },
        {
          id: '2',
          userId: 'user1',
          match: 'São Paulo vs Corinthians',
          betType: BetType.OVER_UNDER,
          selection: 'Ambos Marcam',
          odds: 1.8,
          amount: 50,
          potentialPayout: 90,
          status: BetStatus.LOST,
          result: BetResult.LOSS,
          profit: -50,
          date: new Date('2024-01-14'),
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
          settledAt: new Date('2024-01-14')
        },
        {
          id: '3',
          userId: 'user1',
          match: 'Santos vs Vasco',
          betType: BetType.OVER_UNDER,
          selection: 'Over 2.5 Gols',
          odds: 2.1,
          amount: 75,
          potentialPayout: 157.5,
          status: BetStatus.PENDING,
          result: undefined,
          profit: 0,
          date: new Date('2024-01-16'),
          createdAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-16')
        }
      ];
      
      // Apply filters
      let filteredBets = mockBets;
      
      if (filters.search) {
        filteredBets = filteredBets.filter(bet => 
          bet.match.toLowerCase().includes(filters.search.toLowerCase()) ||
          bet.selection.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.status !== 'all') {
        filteredBets = filteredBets.filter(bet => bet.status === filters.status);
      }
      
      if (filters.type !== 'all') {
        filteredBets = filteredBets.filter(bet => bet.betType === filters.type);
      }
      
      this.bets = filteredBets;
      this.updateFilteredStats();
      
      this.pagination.totalItems = filteredBets.length;
      this.pagination.totalPages = Math.ceil(filteredBets.length / this.pagination.itemsPerPage);
      
      this.isLoading = false;
    }, 500);
  }

  private updateFilteredStats(): void {
    this.filteredStats = {
      total: this.bets.length,
      won: this.bets.filter(bet => bet.status === BetStatus.WON).length,
      lost: this.bets.filter(bet => bet.status === BetStatus.LOST).length,
      pending: this.bets.filter(bet => bet.status === BetStatus.PENDING).length
    };
  }

  clearFilters(): void {
    this.filtersForm.reset({
      search: '',
      status: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: ''
    });
  }



  onSortChange(event: { column: string; direction: 'asc' | 'desc' }): void {
    console.log('Sort change:', event);
    // Implement sorting logic
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      this.loadBets();
    }
  }

  getItemsRange(): string {
    const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
    const end = Math.min(start + this.pagination.itemsPerPage - 1, this.pagination.totalItems);
    return `${start}-${end}`;
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const current = this.pagination.currentPage;
    const total = this.pagination.totalPages;
    
    // Show up to 5 pages
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    
    // Adjust start if we're near the end
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  openDeleteModal(bet: Bet): void {
    this.betToDelete = bet;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.betToDelete = null;
  }

  confirmDelete(): void {
    if (this.betToDelete && !this.isDeleting) {
      this.isDeleting = true;
      
      this.betsService.deleteBet(this.betToDelete.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isDeleting = false;
            this.closeDeleteModal();
            this.loadBets();
            
            // Show success message
            alert('Aposta excluída com sucesso!');
          },
          error: (error) => {
            console.error('Error deleting bet:', error);
            this.isDeleting = false;
            
            // Show error message
            alert('Erro ao excluir aposta. Tente novamente.');
          }
        });
    }
  }

  formatCurrency(value: number): string {
    return this.betsService.formatCurrency(value);
  }
}