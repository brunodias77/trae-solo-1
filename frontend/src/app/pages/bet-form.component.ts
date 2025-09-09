import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BetsService } from '../services/bets.service';
import { Bet, BetType, CreateBetRequest } from '../models/bet.model';
import { CardComponent } from '../shared/card.component';
import { InputComponent } from '../shared/input.component';
import { ButtonComponent } from '../shared/button.component';

@Component({
  selector: 'app-bet-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Editar Aposta' : 'Nova Aposta' }}
          </h1>
          <p class="text-gray-600">
            {{ isEditMode ? 'Modifique os dados da sua aposta' : 'Registre uma nova aposta' }}
          </p>
        </div>
        <app-button
          variant="secondary"
          (click)="goBack()"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voltar
        </app-button>
      </div>

      <form [formGroup]="betForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Match Information -->
        <app-card title="Informações do Jogo" padding="lg" shadow="sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Match -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jogo *
              </label>
              <app-input
                formControlName="match"
                placeholder="Ex: Flamengo vs Palmeiras"
                [error]="getFieldError('match')"
              ></app-input>
              <p class="text-xs text-gray-500 mt-1">
                Digite o nome dos times que estão jogando
              </p>
            </div>

            <!-- League -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Campeonato
              </label>
              <app-input
                formControlName="league"
                placeholder="Ex: Brasileirão Série A"
                [error]="getFieldError('league')"
              ></app-input>
            </div>

            <!-- Match Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Data do Jogo
              </label>
              <app-input
                formControlName="matchDate"
type="date"
                [error]="getFieldError('matchDate')"
              ></app-input>
            </div>
          </div>
        </app-card>

        <!-- Bet Details -->
        <app-card title="Detalhes da Aposta" padding="lg" shadow="sm">
          <div class="space-y-6">
            <!-- Bet Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Aposta *
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                @for (type of betTypes; track type.value) {
                  <label class="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                         [class.border-primary-500]="betForm.get('betType')?.value === type.value"
                         [class.bg-primary-50]="betForm.get('betType')?.value === type.value">
                    <input
                      type="radio"
                      [value]="type.value"
                      formControlName="betType"
                      class="sr-only"
                    >
                    <div class="flex-1">
                      <div class="flex items-center">
                        <div class="w-4 h-4 border-2 rounded-full mr-3"
                             [class.border-primary-500]="betForm.get('betType')?.value === type.value"
                             [class.bg-primary-500]="betForm.get('betType')?.value === type.value">
                          @if (betForm.get('betType')?.value === type.value) {
                            <div class="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          }
                        </div>
                        <span class="font-medium text-gray-900">{{ type.label }}</span>
                      </div>
                      <p class="text-sm text-gray-600 ml-7 mt-1">{{ type.description }}</p>
                    </div>
                  </label>
                }
              </div>
              @if (getFieldError('betType')) {
                <p class="text-sm text-red-600 mt-1">{{ getFieldError('betType') }}</p>
              }
            </div>

            <!-- Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seleção *
              </label>
              <app-input
                formControlName="selection"
                placeholder="Ex: Flamengo Vitória, Over 2.5 Gols, Ambos Marcam"
                [error]="getFieldError('selection')"
              ></app-input>
              <p class="text-xs text-gray-500 mt-1">
                Descreva o que você está apostando
              </p>
            </div>

            <!-- Odds and Amount -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Odds -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Odd *
                </label>
                <app-input
                  formControlName="odds"
                  type="number"
                  step="0.01"
                  min="1.01"
                  placeholder="Ex: 2.50"
                  [error]="getFieldError('odds')"
                  (input)="calculatePayout()"
                ></app-input>
              </div>

              <!-- Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Valor da Aposta *
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                  <app-input
                    formControlName="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="100.00"
                    class="pl-8"
                    [error]="getFieldError('amount')"
                    (input)="calculatePayout()"
                  ></app-input>
                </div>
              </div>
            </div>

            <!-- Potential Payout -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Possível Retorno:</span>
                <span class="text-lg font-bold text-primary-600">
                  {{ formatCurrency(potentialPayout) }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-sm text-gray-600">Lucro Potencial:</span>
                <span class="text-sm font-semibold text-green-600">
                  {{ formatCurrency(potentialProfit) }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                formControlName="notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Adicione observações sobre esta aposta (opcional)..."
              ></textarea>
            </div>
          </div>
        </app-card>

        <!-- Multiple Bet Options (only for Múltipla type) -->
        @if (betForm.get('betType')?.value === 'Múltipla') {
          <app-card title="Apostas Múltiplas" padding="lg" shadow="sm">
            <div class="space-y-4">
              <p class="text-sm text-gray-600">
                Adicione outras seleções para criar uma aposta múltipla
              </p>
              
              @for (selection of multipleSelections; track $index) {
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      [(ngModel)]="selection.match"
                      placeholder="Jogo"
                      [ngModelOptions]="{standalone: true}"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                    <input
                      [(ngModel)]="selection.selection"
                      placeholder="Seleção"
                      [ngModelOptions]="{standalone: true}"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                    <input
                      [(ngModel)]="selection.odds"
                      type="number"
                      step="0.01"
                      placeholder="Odd"
                      [ngModelOptions]="{standalone: true}"
                      (input)="calculateMultipleOdds()"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                  <app-button
                    type="button"
                    variant="danger"
                    size="sm"
                    (click)="removeSelection($index)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </app-button>
                </div>
              }
              
              <app-button
                type="button"
                variant="secondary"
                (click)="addSelection()"
                class="w-full"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Adicionar Seleção
              </app-button>
              
              @if (multipleSelections.length > 0) {
                <div class="bg-primary-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-primary-700">Odd Total:</span>
                    <span class="text-lg font-bold text-primary-600">
                      {{ totalMultipleOdds.toFixed(2) }}
                    </span>
                  </div>
                </div>
              }
            </div>
          </app-card>
        }

        <!-- Form Actions -->
        <div class="flex items-center justify-between pt-6">
          <app-button
            type="button"
            variant="secondary"
            (click)="goBack()"
            [disabled]="isLoading"
          >
            Cancelar
          </app-button>
          
          <div class="flex items-center space-x-3">
            @if (isEditMode) {
              <app-button
                type="button"
                variant="secondary"
                (click)="saveDraft()"
                [disabled]="isLoading"
              >
                Salvar Rascunho
              </app-button>
            }
            
            <app-button
              type="submit"
              variant="primary"
              [disabled]="betForm.invalid || isLoading"
              [loading]="isLoading"
            >
              {{ isEditMode ? 'Atualizar Aposta' : 'Criar Aposta' }}
            </app-button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class BetFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  betForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  betId: string | null = null;
  
  potentialPayout = 0;
  potentialProfit = 0;
  
  multipleSelections: Array<{ match: string; selection: string; odds: number }> = [];
  totalMultipleOdds = 1;
  
  betTypes = [
    {
      value: 'Simples' as BetType,
      label: 'Simples',
      description: 'Uma única seleção'
    },
    {
      value: 'Múltipla' as BetType,
      label: 'Múltipla',
      description: 'Várias seleções combinadas'
    },
    {
      value: 'Sistema' as BetType,
      label: 'Sistema',
      description: 'Combinações parciais'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private betsService: BetsService
  ) {
    this.betForm = this.createBetForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createBetForm(): FormGroup {
    return this.fb.group({
      match: ['', [Validators.required, Validators.minLength(3)]],
      league: [''],
      matchDate: [''],
      betType: ['Simples', [Validators.required]],
      selection: ['', [Validators.required, Validators.minLength(3)]],
      odds: ['', [Validators.required, Validators.min(1.01)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      notes: ['']
    });
  }

  private setupFormSubscriptions(): void {
    // Calculate payout when odds or amount changes
    this.betForm.get('odds')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculatePayout());
      
    this.betForm.get('amount')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculatePayout());
      
    // Reset multiple selections when bet type changes
    this.betForm.get('betType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        if (type !== 'Múltipla') {
          this.multipleSelections = [];
          this.totalMultipleOdds = 1;
        }
      });
  }

  private checkEditMode(): void {
    this.betId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.betId;
    
    if (this.isEditMode && this.betId) {
      this.loadBet(this.betId);
    }
  }

  private loadBet(id: string): void {
    this.isLoading = true;
    
    this.betsService.getBetById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bet) => {
          this.betForm.patchValue({
            match: bet.match,
            betType: bet.betType,
            selection: bet.selection,
            odds: bet.odds,
            amount: bet.amount,
            notes: bet.notes || ''
          });
          
          this.calculatePayout();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading bet:', error);
          this.isLoading = false;
          alert('Erro ao carregar aposta');
          this.goBack();
        }
      });
  }

  calculatePayout(): void {
    const odds = parseFloat(this.betForm.get('odds')?.value) || 0;
    const amount = parseFloat(this.betForm.get('amount')?.value) || 0;
    
    if (odds > 0 && amount > 0) {
      this.potentialPayout = odds * amount;
      this.potentialProfit = this.potentialPayout - amount;
    } else {
      this.potentialPayout = 0;
      this.potentialProfit = 0;
    }
  }

  addSelection(): void {
    this.multipleSelections.push({
      match: '',
      selection: '',
      odds: 0
    });
  }

  removeSelection(index: number): void {
    this.multipleSelections.splice(index, 1);
    this.calculateMultipleOdds();
  }

  calculateMultipleOdds(): void {
    this.totalMultipleOdds = this.multipleSelections.reduce((total, selection) => {
      const odds = parseFloat(selection.odds.toString()) || 1;
      return total * odds;
    }, 1);
    
    // Update main form odds with calculated multiple odds
    if (this.multipleSelections.length > 0) {
      this.betForm.patchValue({ odds: this.totalMultipleOdds });
    }
  }

  onSubmit(): void {
    if (this.betForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.betForm.value;
      const betData: CreateBetRequest = {
        match: formData.match,
        betType: formData.betType,
        odds: parseFloat(formData.odds),
        amount: parseFloat(formData.amount),
        notes: formData.notes
      };
      
      const operation = this.isEditMode && this.betId
        ? this.betsService.updateBet(this.betId, betData)
        : this.betsService.createBet(betData);
      
      operation
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (bet) => {
            this.isLoading = false;
            const message = this.isEditMode ? 'Aposta atualizada com sucesso!' : 'Aposta criada com sucesso!';
            alert(message);
            this.router.navigate(['/bets']);
          },
          error: (error) => {
            console.error('Error saving bet:', error);
            this.isLoading = false;
            alert('Erro ao salvar aposta. Tente novamente.');
          }
        });
    }
  }

  saveDraft(): void {
    if (this.isEditMode && this.betId) {
      // Save as draft logic
      console.log('Saving draft...');
      alert('Rascunho salvo!');
    }
  }

  goBack(): void {
    this.router.navigate(['/bets']);
  }

  getFieldError(fieldName: string): string {
    const field = this.betForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['min']) {
        return `Valor mínimo: ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  formatCurrency(value: number): string {
    return this.betsService.formatCurrency(value);
  }
}