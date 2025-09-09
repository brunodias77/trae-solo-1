import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-1">
      @if (label) {
        <label [for]="id" class="block text-sm font-medium text-gray-700">
          {{ label }}
          @if (required) {
            <span class="text-danger-500 ml-1">*</span>
          }
        </label>
      }
      
      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [class]="inputClasses"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus.emit($event)"
        />
        
        @if (icon) {
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ng-content select="[slot=icon]"></ng-content>
          </div>
        }
        
        @if (suffix) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <ng-content select="[slot=suffix]"></ng-content>
          </div>
        }
      </div>
      
      @if (error) {
        <p class="text-sm text-danger-600 animate-fade-in">{{ error }}</p>
      }
      
      @if (hint && !error) {
        <p class="text-sm text-gray-500">{{ hint }}</p>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = false;
  @Input() suffix = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
  @Output() onFocus = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  
  value = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  get inputClasses(): string {
    const baseClasses = 'block w-full border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };
    
    const stateClasses = this.error 
      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
      : 'border-gray-300 focus:ring-primary-500';
    
    const iconPadding = this.icon ? 'pl-10' : '';
    const suffixPadding = this.suffix ? 'pr-10' : '';
    
    return `${baseClasses} ${sizeClasses[this.size]} ${stateClasses} ${iconPadding} ${suffixPadding}`.trim();
  }
  
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
  
  onBlur(): void {
    this.onTouched();
    this.blur.emit();
  }
  
  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }
  
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}