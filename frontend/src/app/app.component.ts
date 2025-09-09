import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { ButtonComponent } from './shared/button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    ButtonComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      @if (currentUser) {
        <!-- Authenticated Layout -->
        <div class="flex h-screen">
          <!-- Sidebar -->
          <div class="w-64 bg-white shadow-lg flex flex-col">
            <!-- Logo -->
            <div class="flex items-center px-6 py-4 border-b border-gray-200">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <span class="ml-3 text-xl font-bold text-gray-900">BetTracker</span>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-4 py-6 space-y-2">
              @for (item of navigationItems; track item.path) {
                <a
                  [routerLink]="item.path"
                  class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  [class.bg-primary-100]="isActiveRoute(item.path)"
                  [class.text-primary-700]="isActiveRoute(item.path)"
                  [class.text-gray-600]="!isActiveRoute(item.path)"
                  [class.hover:bg-gray-100]="!isActiveRoute(item.path)"
                >
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"></path>
                  </svg>
                  {{ item.label }}
                </a>
              }
            </nav>

            <!-- User Menu -->
            <div class="px-4 py-4 border-t border-gray-200">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">
                    {{ getUserInitials(currentUser.name) }}
                  </span>
                </div>
                <div class="ml-3 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ currentUser.name }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser.email }}</p>
                </div>
                <div class="relative" #userMenuRef>
                  <button
                    (click)="toggleUserMenu()"
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                  
                  @if (showUserMenu) {
                    <div class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <a
                        routerLink="/profile"
                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        (click)="closeUserMenu()"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Meu Perfil
                      </a>
                      <hr class="my-1">
                      <button
                        (click)="logout()"
                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Sair
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Bar -->
            <header class="bg-white shadow-sm border-b border-gray-200">
              <div class="flex items-center justify-between px-6 py-4">
                <div>
                  <h1 class="text-2xl font-bold text-gray-900">{{ getPageTitle() }}</h1>
                  <p class="text-sm text-gray-600">{{ getPageDescription() }}</p>
                </div>
                
                @if (showCreateButton()) {
                  <app-button
                    variant="primary"
                    (click)="navigateToCreate()"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Nova Aposta
                  </app-button>
                }
              </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 overflow-auto p-6">
              <router-outlet></router-outlet>
            </main>
          </div>
        </div>
      } @else {
        <!-- Guest Layout -->
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50">
          <div class="max-w-md w-full">
            <!-- Logo -->
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h1 class="text-3xl font-bold text-gray-900">BetTracker</h1>
              <p class="text-gray-600 mt-2">Gerencie suas apostas esportivas</p>
            </div>
            
            <!-- Auth Content -->
            <router-outlet></router-outlet>
          </div>
        </div>
      }
    </div>

    <!-- Loading Overlay -->
    @if (isLoading) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span class="text-gray-900">Carregando...</span>
        </div>
      </div>
    }
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  isLoading = false;
  showUserMenu = false;
  currentRoute = '';
  
  navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z'
    },
    {
      path: '/bets',
      label: 'Minhas Apostas',
      icon: 'M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13'
    },
    {
      path: '/bets/create',
      label: 'Nova Aposta',
      icon: 'M12 4v16m8-8H4'
    }
  ];
  
  pageTitles: Record<string, { title: string; description: string }> = {
    '/dashboard': {
      title: 'Dashboard',
      description: 'Visão geral das suas apostas e estatísticas'
    },
    '/bets': {
      title: 'Minhas Apostas',
      description: 'Gerencie todas as suas apostas'
    },
    '/bets/create': {
      title: 'Nova Aposta',
      description: 'Registre uma nova aposta'
    },
    '/profile': {
      title: 'Meu Perfil',
      description: 'Gerencie suas informações pessoais'
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupAuthSubscription();
    this.setupRouterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAuthSubscription(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        
        // Redirect to dashboard if user logs in and is on auth pages
        if (user && (this.currentRoute === '/login' || this.currentRoute === '/register' || this.currentRoute === '/')) {
          this.router.navigate(['/dashboard']);
        }
        
        // Redirect to login if user logs out
        if (!user && this.currentRoute !== '/login' && this.currentRoute !== '/register') {
          this.router.navigate(['/login']);
        }
      });
  }

  private setupRouterSubscription(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.closeUserMenu();
      });
  }

  isActiveRoute(path: string): boolean {
    if (path === '/dashboard') {
      return this.currentRoute === '/' || this.currentRoute === '/dashboard';
    }
    return this.currentRoute.startsWith(path);
  }

  getPageTitle(): string {
    const pageInfo = this.getPageInfo();
    return pageInfo.title;
  }

  getPageDescription(): string {
    const pageInfo = this.getPageInfo();
    return pageInfo.description;
  }

  private getPageInfo(): { title: string; description: string } {
    // Check for exact matches first
    if (this.pageTitles[this.currentRoute]) {
      return this.pageTitles[this.currentRoute];
    }
    
    // Check for pattern matches
    if (this.currentRoute.startsWith('/bets/edit/')) {
      return { title: 'Editar Aposta', description: 'Modifique os dados da sua aposta' };
    }
    
    if (this.currentRoute.startsWith('/bets/') && this.currentRoute !== '/bets/create') {
      return { title: 'Detalhes da Aposta', description: 'Visualize os detalhes da sua aposta' };
    }
    
    // Default
    return { title: 'BetTracker', description: 'Gerencie suas apostas esportivas' };
  }

  showCreateButton(): boolean {
    return this.currentRoute === '/dashboard' || this.currentRoute === '/bets';
  }

  navigateToCreate(): void {
    this.router.navigate(['/bets/create']);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  logout(): void {
    this.isLoading = true;
    this.closeUserMenu();
    
    this.authService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          this.isLoading = false;
          // Force logout even if API call fails
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      });
  }
}