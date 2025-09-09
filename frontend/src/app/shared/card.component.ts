import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      @if (title || subtitle) {
        <div class="border-b border-gray-200 pb-4 mb-4">
          @if (title) {
            <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          }
          @if (subtitle) {
            <p class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
          }
        </div>
      }
      
      <div class="card-content">
        <ng-content></ng-content>
      </div>
      
      @if (hasFooter) {
        <div class="border-t border-gray-200 pt-4 mt-4">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() border = true;
  @Input() rounded = true;
  @Input() hasFooter = false;
  @Input() hover = false;
  
  get cardClasses(): string {
    const baseClasses = 'bg-white transition-all duration-200';
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };
    
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };
    
    const borderClass = this.border ? 'border border-gray-200' : '';
    const roundedClass = this.rounded ? 'rounded-lg' : '';
    const hoverClass = this.hover ? 'hover:shadow-md hover:-translate-y-1' : '';
    
    return `${baseClasses} ${paddingClasses[this.padding]} ${shadowClasses[this.shadow]} ${borderClass} ${roundedClass} ${hoverClass}`.trim();
  }
}