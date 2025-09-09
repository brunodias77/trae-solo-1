import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'currency' | 'badge' | 'actions';
}

export interface TableAction {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  action: (item: any) => void;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Header -->
          <thead class="bg-gray-50">
            <tr>
              @for (column of columns; track column.key) {
                <th 
                  class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  [class]="getHeaderClasses(column)"
                  [style.width]="column.width"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ column.label }}</span>
                    @if (column.sortable) {
                      <button
                        type="button"
                        class="text-gray-400 hover:text-gray-600"
                        (click)="onSort(column.key)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          @if (sortColumn === column.key) {
                            @if (sortDirection === 'asc') {
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                            } @else {
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            }
                          } @else {
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                          }
                        </svg>
                      </button>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          
          <!-- Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            @if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex flex-col items-center space-y-2">
                    <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"></path>
                    </svg>
                    <p class="text-sm">{{ emptyMessage }}</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (item of data; track trackByFn(item); let i = $index) {
                <tr class="hover:bg-gray-50 transition-colors" [class.bg-gray-50]="i % 2 === 1 && striped">
                  @for (column of columns; track column.key) {
                    <td class="px-6 py-4 whitespace-nowrap" [class]="getCellClasses(column)">
                      @switch (column.type) {
                        @case ('badge') {
                          <span [class]="getBadgeClasses(getValue(item, column.key))">
                            {{ getValue(item, column.key) }}
                          </span>
                        }
                        @case ('currency') {
                          <span [class]="getCurrencyClasses(getValue(item, column.key))">
                            {{ formatCurrency(getValue(item, column.key)) }}
                          </span>
                        }
                        @case ('date') {
                          <span class="text-sm text-gray-900">
                            {{ formatDate(getValue(item, column.key)) }}
                          </span>
                        }
                        @case ('actions') {
                          <div class="flex items-center space-x-2">
                            @for (action of actions; track action.label) {
                              <app-button
                                [variant]="action.variant || 'secondary'"
                                [size]="action.size || 'sm'"
                                (click)="action.action(item)"
                              >
                                {{ action.label }}
                              </app-button>
                            }
                          </div>
                        }
                        @default {
                          <span class="text-sm text-gray-900">
                            {{ getValue(item, column.key) }}
                          </span>
                        }
                      }
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      @if (showPagination && totalItems > pageSize) {
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                type="button"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                [disabled]="currentPage === 1"
                (click)="onPageChange(currentPage - 1)"
              >
                Anterior
              </button>
              <button
                type="button"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                [disabled]="currentPage === totalPages"
                (click)="onPageChange(currentPage + 1)"
              >
                Próximo
              </button>
            </div>
            
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium">{{ startItem }}</span>
                  até
                  <span class="font-medium">{{ endItem }}</span>
                  de
                  <span class="font-medium">{{ totalItems }}</span>
                  resultados
                </p>
              </div>
              
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <!-- Previous -->
                  <button
                    type="button"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    [disabled]="currentPage === 1"
                    (click)="onPageChange(currentPage - 1)"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- Pages -->
                  @for (page of getVisiblePages(); track page) {
                    <button
                      type="button"
                      class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      [class]="getPageClasses(page)"
                      (click)="onPageChange(page)"
                    >
                      {{ page }}
                    </button>
                  }
                  
                  <!-- Next -->
                  <button
                    type="button"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    [disabled]="currentPage === totalPages"
                    (click)="onPageChange(currentPage + 1)"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() striped = false;
  @Input() emptyMessage = 'Nenhum dado encontrado';
  @Input() showPagination = false;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() sortColumn = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<number>();
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  
  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
  
  trackByFn(item: any): any {
    return item.id || item;
  }
  
  getValue(item: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], item);
  }
  
  getHeaderClasses(column: TableColumn): string {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    
    return alignClasses[column.align || 'left'];
  }
  
  getCellClasses(column: TableColumn): string {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    
    return alignClasses[column.align || 'left'];
  }
  
  getBadgeClasses(value: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    // Customize based on your badge types
    const statusClasses: { [key: string]: string } = {
      'Ganhou': 'bg-green-100 text-green-800',
      'Perdeu': 'bg-red-100 text-red-800',
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Cancelada': 'bg-gray-100 text-gray-800'
    };
    
    return `${baseClasses} ${statusClasses[value] || 'bg-gray-100 text-gray-800'}`;
  }
  
  getCurrencyClasses(value: number): string {
    if (value > 0) {
      return 'text-sm font-medium text-green-600';
    } else if (value < 0) {
      return 'text-sm font-medium text-red-600';
    }
    return 'text-sm text-gray-900';
  }
  
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  
  formatDate(value: string | Date): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  
  onSort(column: string): void {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (this.sortColumn === column) {
      direction = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    this.sortColumn = column;
    this.sortDirection = direction;
    
    this.sortChange.emit({ column, direction });
  }
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }
  
  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  getPageClasses(page: number): string {
    const baseClasses = 'border-gray-300';
    
    if (page === this.currentPage) {
      return `${baseClasses} bg-primary-50 border-primary-500 text-primary-600 z-10`;
    }
    
    return `${baseClasses} bg-white text-gray-500 hover:bg-gray-50`;
  }
}