import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"></div>
        
        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            class="relative bg-white rounded-lg shadow-xl w-full animate-slide-up"
            [class]="modalSizeClasses"
            (click)="$event.stopPropagation()"
          >
            <!-- Header -->
            @if (title || showCloseButton) {
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                @if (title) {
                  <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                }
                @if (showCloseButton) {
                  <button
                    type="button"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    (click)="close()"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }
              </div>
            }
            
            <!-- Content -->
            <div [class]="contentPaddingClasses">
              <ng-content></ng-content>
            </div>
            
            <!-- Footer -->
            @if (hasFooter) {
              <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <ng-content select="[slot=footer]"></ng-content>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() hasFooter = false;
  @Input() contentPadding = true;
  
  @Output() onClose = new EventEmitter<void>();
  @Output() onOpen = new EventEmitter<void>();
  @Output() isOpenChange = new EventEmitter<boolean>();
  
  ngOnInit(): void {
    if (this.isOpen) {
      this.handleOpen();
    }
  }
  
  ngOnDestroy(): void {
    this.handleClose();
  }
  
  ngOnChanges(): void {
    if (this.isOpen) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
  }
  
  get modalSizeClasses(): string {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-7xl'
    };
    
    return sizeClasses[this.size];
  }
  
  get contentPaddingClasses(): string {
    return this.contentPadding ? 'p-6' : '';
  }
  
  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.onClose.emit();
    this.handleClose();
  }
  
  open(): void {
    this.isOpen = true;
    this.isOpenChange.emit(true);
    this.onOpen.emit();
    this.handleOpen();
  }
  
  onBackdropClick(event: Event): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }
  
  private handleOpen(): void {
    document.body.style.overflow = 'hidden';
    
    // Handle ESC key
    document.addEventListener('keydown', this.handleEscKey);
  }
  
  private handleClose(): void {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleEscKey);
  }
  
  private handleEscKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }
}