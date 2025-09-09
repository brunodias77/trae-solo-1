import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { CardComponent } from '../shared/card.component';
import { InputComponent } from '../shared/input.component';
import { ButtonComponent } from '../shared/button.component';
import { ModalComponent } from '../shared/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent,
    ModalComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p class="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Info -->
        <div class="lg:col-span-1">
          <app-card padding="lg" shadow="sm">
            <div class="text-center">
              <!-- Avatar -->
              <div class="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {{ currentUser?.name || 'Usuário' }}
              </h3>
              <p class="text-gray-600 mb-4">{{ currentUser?.email }}</p>
              
              <!-- Stats -->
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div class="text-center">
                  <p class="text-2xl font-bold text-primary-600">{{ userStats.totalBets }}</p>
                  <p class="text-sm text-gray-600">Apostas</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-green-600">{{ formatPercentage(userStats.winRate) }}</p>
                  <p class="text-sm text-gray-600">Taxa de Acerto</p>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <app-card title="Informações Pessoais" padding="lg" shadow="sm">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <app-input
                    formControlName="name"
                    placeholder="Digite seu nome completo"
                    [error]="getFieldError('name')"
                  ></app-input>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <app-input
                    formControlName="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    [error]="getFieldError('email')"
                  ></app-input>
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <app-input
                  formControlName="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  [error]="getFieldError('phone')"
                ></app-input>
              </div>

              <!-- Birth Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                <app-input
                  formControlName="birthDate"
                  type="date"
                  [error]="getFieldError('birthDate')"
                ></app-input>
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sobre você
                </label>
                <textarea
                  formControlName="bio"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Conte um pouco sobre você..."
                ></textarea>
              </div>

              <!-- Form Actions -->
              <div class="flex items-center justify-between pt-6 border-t border-gray-200">
                <app-button
                  type="button"
                  variant="secondary"
                  (click)="resetForm()"
                  [disabled]="isLoading"
                >
                  Cancelar
                </app-button>
                
                <app-button
                  type="submit"
                  variant="primary"
                  [disabled]="profileForm.invalid || isLoading"
                  [loading]="isLoading"
                >
                  Salvar Alterações
                </app-button>
              </div>
            </form>
          </app-card>
        </div>
      </div>

      <!-- Security Section -->
      <app-card title="Segurança" padding="lg" shadow="sm">
        <div class="space-y-6">
          <!-- Change Password -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900">Alterar Senha</h4>
              <p class="text-sm text-gray-600">Mantenha sua conta segura com uma senha forte</p>
            </div>
            <app-button
              variant="secondary"
              size="sm"
              (click)="openChangePasswordModal()"
            >
              Alterar Senha
            </app-button>
          </div>

          <!-- Two Factor Authentication -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
              <p class="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-600">Em breve</span>
              <div class="w-10 h-6 bg-gray-200 rounded-full relative opacity-50">
                <div class="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
              </div>
            </div>
          </div>

          <!-- Delete Account -->
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h4 class="font-medium text-red-900">Excluir Conta</h4>
              <p class="text-sm text-red-600">Esta ação não pode ser desfeita</p>
            </div>
            <app-button
              variant="danger"
              size="sm"
              (click)="openDeleteAccountModal()"
            >
              Excluir Conta
            </app-button>
          </div>
        </div>
      </app-card>
    </div>

    <!-- Change Password Modal -->
    <app-modal
      [(isOpen)]="showChangePasswordModal"
      title="Alterar Senha"
      size="md"
    >
      <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Senha Atual
          </label>
          <app-input
            formControlName="currentPassword"
            type="password"
            placeholder="Digite sua senha atual"
            [error]="getPasswordFieldError('currentPassword')"
          ></app-input>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nova Senha
          </label>
          <app-input
            formControlName="newPassword"
            type="password"
            placeholder="Digite sua nova senha"
            [error]="getPasswordFieldError('newPassword')"
          ></app-input>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Nova Senha
          </label>
          <app-input
            formControlName="confirmPassword"
            type="password"
            placeholder="Confirme sua nova senha"
            [error]="getPasswordFieldError('confirmPassword')"
          ></app-input>
        </div>

        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <app-button
            type="button"
            variant="secondary"
            (click)="closeChangePasswordModal()"
            [disabled]="isChangingPassword"
          >
            Cancelar
          </app-button>
          
          <app-button
            type="submit"
            variant="primary"
            [disabled]="passwordForm.invalid || isChangingPassword"
            [loading]="isChangingPassword"
          >
            Alterar Senha
          </app-button>
        </div>
      </form>
    </app-modal>

    <!-- Delete Account Modal -->
    <app-modal
      [(isOpen)]="showDeleteAccountModal"
      title="Excluir Conta"
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
              <div class="mt-2 text-sm text-red-700">
                <p>Esta ação irá:</p>
                <ul class="list-disc list-inside mt-1 space-y-1">
                  <li>Excluir permanentemente sua conta</li>
                  <li>Remover todos os seus dados</li>
                  <li>Excluir histórico de apostas</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Digite "EXCLUIR" para confirmar
          </label>
          <app-input
            [(ngModel)]="deleteConfirmation"
            placeholder="EXCLUIR"
            class="font-mono"
          ></app-input>
        </div>

        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <app-button
            type="button"
            variant="secondary"
            (click)="closeDeleteAccountModal()"
            [disabled]="isDeletingAccount"
          >
            Cancelar
          </app-button>
          
          <app-button
            type="button"
            variant="danger"
            [disabled]="deleteConfirmation !== 'EXCLUIR' || isDeletingAccount"
            [loading]="isDeletingAccount"
            (click)="onDeleteAccount()"
          >
            Excluir Conta
          </app-button>
        </div>
      </div>
    </app-modal>
  `
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  userStats = { totalBets: 0, winRate: 0 };
  
  isLoading = false;
  isChangingPassword = false;
  isDeletingAccount = false;
  
  showChangePasswordModal = false;
  showDeleteAccountModal = false;
  deleteConfirmation = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.createProfileForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthDate: [''],
      bio: ['']
    });
  }

  private createPasswordForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            birthDate: user.birthDate || '',
            bio: user.bio || ''
          });
        }
      });
  }

  private loadUserStats(): void {
    // Mock data - replace with actual service call
    this.userStats = {
      totalBets: 25,
      winRate: 68.5
    };
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formData = this.profileForm.value;
      
      // Mock API call - replace with actual service
      setTimeout(() => {
        console.log('Profile updated:', formData);
        this.isLoading = false;
        
        // Show success message
        alert('Perfil atualizado com sucesso!');
      }, 1000);
    }
  }

  resetForm(): void {
    this.loadUserData();
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.passwordForm.reset();
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.passwordForm.reset();
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && !this.isChangingPassword) {
      this.isChangingPassword = true;
      
      const formData = this.passwordForm.value;
      
      // Mock API call - replace with actual service
      setTimeout(() => {
        console.log('Password changed:', formData);
        this.isChangingPassword = false;
        this.closeChangePasswordModal();
        
        // Show success message
        alert('Senha alterada com sucesso!');
      }, 1000);
    }
  }

  openDeleteAccountModal(): void {
    this.showDeleteAccountModal = true;
    this.deleteConfirmation = '';
  }

  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
    this.deleteConfirmation = '';
  }

  onDeleteAccount(): void {
    if (this.deleteConfirmation === 'EXCLUIR' && !this.isDeletingAccount) {
      this.isDeletingAccount = true;
      
      // Mock API call - replace with actual service
      setTimeout(() => {
        console.log('Account deleted');
        this.isDeletingAccount = false;
        this.closeDeleteAccountModal();
        
        // Logout and redirect
        this.authService.logout();
      }, 2000);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['email']) {
        return 'E-mail inválido';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo é obrigatório';
      }
      if (field.errors['minlength']) {
        return `Mínimo de ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (fieldName === 'confirmPassword' && field.errors['mismatch']) {
        return 'As senhas não coincidem';
      }
    }
    return '';
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}