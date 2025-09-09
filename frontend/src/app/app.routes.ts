import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './guards/auth.guard';

// Lazy loading components
const LoginComponent = () => import('./pages/login.component').then(m => m.LoginComponent);
const RegisterComponent = () => import('./pages/register.component').then(m => m.RegisterComponent);
const DashboardComponent = () => import('./pages/dashboard.component').then(m => m.DashboardComponent);
const ProfileComponent = () => import('./pages/profile.component').then(m => m.ProfileComponent);
const BetsListComponent = () => import('./pages/bets-list.component').then(m => m.BetsListComponent);
const BetFormComponent = () => import('./pages/bet-form.component').then(m => m.BetFormComponent);
const BetDetailsComponent = () => import('./pages/bet-details.component').then(m => m.BetDetailsComponent);

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Guest routes (only accessible when not authenticated)
  {
    path: 'login',
    loadComponent: LoginComponent,
    canActivate: [GuestGuard],
    title: 'Login - BetTracker'
  },
  {
    path: 'register',
    loadComponent: RegisterComponent,
    canActivate: [GuestGuard],
    title: 'Cadastro - BetTracker'
  },
  
  // Protected routes (only accessible when authenticated)
  {
    path: 'dashboard',
    loadComponent: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Dashboard - BetTracker'
  },
  {
    path: 'profile',
    loadComponent: ProfileComponent,
    canActivate: [AuthGuard],
    title: 'Meu Perfil - BetTracker'
  },
  
  // Bets routes
  {
    path: 'bets',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: BetsListComponent,
        title: 'Minhas Apostas - BetTracker'
      },
      {
        path: 'create',
        loadComponent: BetFormComponent,
        title: 'Nova Aposta - BetTracker'
      },
      {
        path: 'edit/:id',
        loadComponent: BetFormComponent,
        title: 'Editar Aposta - BetTracker'
      },
      {
        path: ':id',
        loadComponent: BetDetailsComponent,
        title: 'Detalhes da Aposta - BetTracker'
      }
    ]
  },
  
  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];