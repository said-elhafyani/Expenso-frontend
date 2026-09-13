import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        <div class="bg-surface p-10 rounded-3xl shadow-xl w-full max-w-md relative z-10 border border-slate-100">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-secondary text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-purple-200">
                    <i class="fa-solid fa-user-plus"></i>
                </div>
                <h1 class="text-2xl font-bold text-slate-800">Créer un compte</h1>
                <p class="text-slate-500 mt-2">Rejoignez Expenso aujourd'hui</p>
            </div>

            <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                    <input type="text" name="name" [(ngModel)]="form.name" required 
                           class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-slate-50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" [(ngModel)]="form.email" required 
                           class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-slate-50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                    <input type="password" name="password" [(ngModel)]="form.password" required 
                           class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all bg-slate-50">
                </div>
                
                <div *ngIf="errorMessage" class="p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                    {{ errorMessage }}
                </div>
                <div *ngIf="successMessage" class="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm text-center">
                    {{ successMessage }}
                </div>

                <button type="submit" [disabled]="!f.form.valid || isLoading"
                        class="w-full py-3.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-all active:scale-95 disabled:opacity-70">
                    <span *ngIf="!isLoading">S'inscrire</span>
                    <span *ngIf="isLoading"><i class="fa-solid fa-circle-notch fa-spin"></i> Inscription...</span>
                </button>
            </form>

            <p class="text-center text-sm text-slate-500 mt-8">
                Vous avez déjà un compte ? 
                <a routerLink="/login" class="text-secondary font-bold hover:underline">Connectez-vous</a>
            </p>
        </div>
    </div>
  `
})
export class RegisterComponent {
  form: any = {
    name: '',
    email: '',
    password: ''
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const { name, email, password } = this.form;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register({ name, email, password }).subscribe({
      next: data => {
        this.isLoading = false;
        this.successMessage = "Inscription réussie ! Vous allez être redirigé...";
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error || "Erreur lors de l'inscription.";
      }
    });
  }
}
