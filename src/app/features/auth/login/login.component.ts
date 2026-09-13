import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <!-- Deco -->
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div class="bg-surface p-10 rounded-3xl shadow-xl w-full max-w-md relative z-10 border border-slate-100">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <i class="fa-solid fa-wallet"></i>
                </div>
                <h1 class="text-2xl font-bold text-slate-800">Bienvenue sur Expenso</h1>
                <p class="text-slate-500 mt-2">Connectez-vous pour gérer vos finances</p>
            </div>

            <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" [(ngModel)]="form.email" required 
                           class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-slate-50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                    <input type="password" name="password" [(ngModel)]="form.password" required 
                           class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-slate-50">
                </div>
                
                <div *ngIf="errorMessage" class="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                    {{ errorMessage }}
                </div>

                <button type="submit" [disabled]="!f.form.valid || isLoading"
                        class="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70">
                    <span *ngIf="!isLoading">Se connecter</span>
                    <span *ngIf="isLoading"><i class="fa-solid fa-circle-notch fa-spin"></i> Connexion...</span>
                </button>
            </form>

            <p class="text-center text-sm text-slate-500 mt-8">
                Vous n'avez pas de compte ? 
                <a routerLink="/register" class="text-primary font-bold hover:underline">Inscrivez-vous</a>
            </p>
        </div>
    </div>
  `
})
export class LoginComponent {
  form: any = {
    email: 'admin@expenso.com',
    password: 'admin'
  };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const { email, password } = this.form;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email, password }).subscribe({
      next: data => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = "Identifiants incorrects ou serveur indisponible.";
      }
    });
  }
}
