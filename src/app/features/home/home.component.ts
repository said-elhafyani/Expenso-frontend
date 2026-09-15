import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Top Navigation (Public) -->
    <header class="fixed top-0 w-full z-50 glass-effect border-b border-slate-200/50 px-6 py-4 transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-md">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <img src="assets/logo.png" alt="Expenso Logo" class="w-12 h-12 rounded-2xl shadow-md border border-slate-100">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]">Expenso</span>
            </div>
            
            <div class="flex items-center gap-3 md:gap-4">
                <button (click)="openAuthModal('login')" class="hidden md:inline-flex px-5 py-2.5 text-slate-600 font-medium hover:text-[#6366f1] transition-colors">Se connecter</button>
                <button (click)="openAuthModal('register')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:opacity-90 text-white font-medium transition-all shadow-md shadow-indigo-200">
                    S'inscrire <i class="fa-solid fa-arrow-right ml-1"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="min-h-screen pt-24 pb-12 flex flex-col items-center overflow-x-hidden relative">
        
        <!-- Enhanced Background Effects -->
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div class="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 blur-[100px] animate-blob"></div>
            <div class="absolute top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-[#ec4899]/15 to-[#8b5cf6]/15 blur-[100px] animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-t from-[#10b981]/10 to-[#3b82f6]/10 blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <!-- Hero Section -->
        <section class="w-full max-w-6xl mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center animate-fade-in relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50/80 backdrop-blur-sm rounded-full mb-8 border border-indigo-100 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse"></span>
                <span class="text-xs font-bold text-[#6366f1] uppercase tracking-wider">L'application Ultime</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6">
                Maîtrisez <br class="hidden md:block">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#ec4899]">votre argent.</span>
            </h1>
            
            <p class="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Le suivi de budget réinventé. Simple, rapide, et magnifique. Gardez un œil sur vos finances et atteignez vos objectifs sereinement.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
                <button (click)="openAuthModal('register')" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:shadow-indigo-500/30 text-white font-bold text-lg transition-all active:scale-95 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
                    <i class="fa-solid fa-rocket group-hover:-translate-y-1 transition-transform"></i> Créer mon compte
                </button>
                <button (click)="openAuthModal('login')" class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i class="fa-solid fa-right-to-bracket"></i> Me connecter
                </button>
            </div>
        </section>

        <!-- Mockup / Image Area -->
        <section class="w-full max-w-5xl mx-auto px-6 mb-24 animate-fade-in relative z-10" style="animation-delay: 0.2s;">
            <div class="relative rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-white to-slate-50 border-4 border-white shadow-2xl p-2 md:p-4 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/5 to-[#ec4899]/5"></div>
                <!-- Abstract visual representing the app -->
                <div class="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10 relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div class="flex-1 space-y-6 w-full">
                        <div class="flex items-center gap-4 mb-4">
                            <img src="assets/logo.png" alt="Logo" class="w-12 h-12 rounded-xl shadow-sm">
                            <div class="h-6 w-32 bg-slate-100 rounded-lg"></div>
                        </div>
                        <div class="h-32 w-full bg-gradient-to-r from-[#efeefe] to-[#f4f2ff] rounded-2xl flex items-center p-6 gap-4">
                            <div class="w-12 h-12 rounded-xl bg-[#6366f1] opacity-90 text-white flex items-center justify-center text-xl shadow-md"><i class="fa-solid fa-wallet"></i></div>
                            <div class="flex-1 space-y-3">
                                <div class="h-4 w-24 bg-indigo-200 rounded"></div>
                                <div class="h-6 w-32 bg-[#6366f1] rounded opacity-70"></div>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="h-16 w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl flex items-center px-4 gap-4 border border-slate-100"><div class="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-500"><i class="fa-solid fa-film"></i></div><div class="flex-1 h-4 bg-slate-200 rounded"></div></div>
                            <div class="h-16 w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl flex items-center px-4 gap-4 border border-slate-100"><div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500"><i class="fa-solid fa-utensils"></i></div><div class="flex-1 h-4 bg-slate-200 rounded"></div></div>
                            <div class="h-16 w-full bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl flex items-center px-4 gap-4 border border-slate-100"><div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-500"><i class="fa-solid fa-gift"></i></div><div class="flex-1 h-4 bg-slate-200 rounded"></div></div>
                        </div>
                    </div>
                    <div class="hidden md:flex flex-1 flex-col justify-center gap-6">
                        <div class="h-48 w-full rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-6 relative overflow-hidden shadow-inner hover:scale-[1.02] transition-transform cursor-default">
                            <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-orange-200/50 to-transparent"></div>
                            <div class="h-6 w-24 bg-orange-300 rounded mb-2"></div>
                            <div class="h-8 w-32 bg-orange-500 rounded opacity-80"></div>
                            <i class="fa-solid fa-chart-pie absolute -bottom-4 -right-4 text-8xl text-orange-200 opacity-50"></i>
                        </div>
                        <div class="h-48 w-full rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 p-6 relative overflow-hidden shadow-inner hover:scale-[1.02] transition-transform cursor-default">
                            <div class="absolute bottom-0 right-0 w-24 h-24 bg-teal-200/30 rounded-tl-full"></div>
                            <div class="h-6 w-24 bg-teal-300 rounded mb-2"></div>
                            <div class="h-8 w-32 bg-teal-500 rounded opacity-80"></div>
                            <i class="fa-solid fa-chart-line absolute -bottom-4 -right-4 text-8xl text-teal-200 opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="w-full max-w-6xl mx-auto px-6 py-12 relative z-10">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Pourquoi choisir Expenso ?</h2>
                <p class="text-slate-500 max-w-2xl mx-auto text-lg">Une plateforme conçue pour la simplicité et l'efficacité, sans aucun compromis sur la puissance.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-[#6366f1] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-[#6366f1] group-hover:text-white transition-all">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Statistiques détaillées</h3>
                    <p class="text-slate-500 leading-relaxed">Visualisez vos habitudes de dépenses avec des graphiques clairs et précis pour mieux comprendre où va votre argent.</p>
                </div>
                
                <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-2xl bg-pink-50 text-[#ec4899] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-[#ec4899] group-hover:text-white transition-all">
                        <i class="fa-solid fa-tags"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Catégorisation intelligente</h3>
                    <p class="text-slate-500 leading-relaxed">Triez vos transactions par catégories avec des codes couleurs intuitifs pour une lecture instantanée de votre budget.</p>
                </div>
                
                <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all duration-300 group">
                    <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-[#10b981] group-hover:text-white transition-all">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-3">Sécurité maximale</h3>
                    <p class="text-slate-500 leading-relaxed">Vos données financières sont protégées. Seul vous avez accès à votre historique et à vos statistiques privées.</p>
                </div>
            </div>
        </section>

        <!-- How it works -->
        <section class="w-full bg-slate-50 border-y border-slate-200/50 relative z-10 py-20 mt-12">
            <div class="max-w-6xl mx-auto px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Comment ça marche ?</h2>
                    <p class="text-slate-500 max-w-2xl mx-auto text-lg">Trois étapes simples pour reprendre le contrôle total de vos finances.</p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-8 relative">
                    <!-- Line connector -->
                    <div class="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 -translate-y-1/2 z-0"></div>
                    
                    <div class="flex-1 text-center relative z-10 group">
                        <div class="w-20 h-20 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:border-indigo-100 transition-all duration-300">
                            <span class="text-2xl font-bold text-[#6366f1]">1</span>
                        </div>
                        <h4 class="text-xl font-bold text-slate-800 mb-2">Créez un compte</h4>
                        <p class="text-slate-500 text-sm px-4">Inscription gratuite en quelques clics pour sécuriser votre espace personnel.</p>
                    </div>
                    
                    <div class="flex-1 text-center relative z-10 group">
                        <div class="w-20 h-20 mx-auto bg-white border-4 border-purple-50 rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:border-purple-100 transition-all duration-300">
                            <span class="text-2xl font-bold text-[#8b5cf6]">2</span>
                        </div>
                        <h4 class="text-xl font-bold text-slate-800 mb-2">Ajoutez vos dépenses</h4>
                        <p class="text-slate-500 text-sm px-4">Saisissez rapidement vos entrées et sorties d'argent, et classez-les par catégorie.</p>
                    </div>
                    
                    <div class="flex-1 text-center relative z-10 group">
                        <div class="w-20 h-20 mx-auto bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:border-emerald-100 transition-all duration-300">
                            <span class="text-2xl font-bold text-[#10b981]">3</span>
                        </div>
                        <h4 class="text-xl font-bold text-slate-800 mb-2">Analysez & Économisez</h4>
                        <p class="text-slate-500 text-sm px-4">Consultez vos graphiques détaillés pour ajuster vos habitudes et faire des économies.</p>
                    </div>
                </div>
            </div>
        </section>

    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200/60 pt-16 pb-8 relative z-10">
        <div class="max-w-6xl mx-auto px-6">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div class="flex items-center gap-3">
                    <img src="assets/logo.png" alt="Expenso Logo" class="w-8 h-8 rounded-lg shadow-sm border border-slate-200">
                    <span class="text-xl font-bold text-slate-400">Expenso</span>
                </div>
                <div class="flex gap-6 text-sm font-medium text-slate-500">
                    <a href="#" class="hover:text-[#6366f1] transition-colors">À propos</a>
                    <a href="#" class="hover:text-[#6366f1] transition-colors">Confidentialité</a>
                    <a href="#" class="hover:text-[#6366f1] transition-colors">Conditions</a>
                    <a href="#" class="hover:text-[#6366f1] transition-colors">Contact</a>
                </div>
            </div>
            <div class="text-center text-slate-400 text-sm">
                &copy; 2026 Expenso. Tous droits réservés.
            </div>
        </div>
    </footer>

    <!-- Auth Modal -->
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
         [class.hidden]="!isAuthModalOpen"
         [class.opacity-0]="!isAuthModalOpen"
         [class.pointer-events-none]="!isAuthModalOpen">
        
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 relative border border-slate-100"
             [class.scale-95]="!isAuthModalOpen"
             [class.opacity-0]="!isAuthModalOpen"
             [class.scale-100]="isAuthModalOpen"
             [class.opacity-100]="isAuthModalOpen">
            
            <!-- Abstract decor inside modal -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-[#6366f1] rounded-bl-full opacity-10 pointer-events-none"></div>

            <div class="p-6 text-right">
                <button (click)="closeAuthModal()" class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 inline-flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="px-8 pb-10">
                <div class="text-center mb-8">
                    <img src="assets/logo.png" alt="Logo" class="w-16 h-16 mx-auto rounded-2xl shadow-md border border-slate-100 mb-4">
                    <h2 class="text-2xl font-bold text-slate-800">{{ authView === 'login' ? 'Bon retour !' : 'Créer un compte' }}</h2>
                    <p class="text-slate-500 mt-1">{{ authView === 'login' ? 'Connectez-vous à votre espace personnel.' : 'Rejoignez Expenso aujourd\\'hui.' }}</p>
                </div>

                <!-- Form -->
                <form (ngSubmit)="onAuthSubmit()" #f="ngForm" class="space-y-5">
                    
                    <div *ngIf="authView === 'register'" class="animate-fade-in">
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-regular fa-user"></i>
                            </div>
                            <input type="text" name="name" [(ngModel)]="authForm.name" [required]="authView === 'register'" placeholder="John Doe"
                                   class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all bg-slate-50">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-regular fa-envelope"></i>
                            </div>
                            <input type="email" name="email" [(ngModel)]="authForm.email" required placeholder="admin@expenso.com"
                                   class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all bg-slate-50">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <i class="fa-solid fa-lock"></i>
                            </div>
                            <input type="password" name="password" [(ngModel)]="authForm.password" required placeholder="••••••••"
                                   class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] transition-all bg-slate-50">
                        </div>
                    </div>
                    
                    <div *ngIf="authErrorMessage" class="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
                        <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                        <span>{{ authErrorMessage }}</span>
                    </div>
                    
                    <div *ngIf="authSuccessMessage" class="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-sm flex items-start gap-2">
                        <i class="fa-solid fa-circle-check mt-0.5"></i>
                        <span>{{ authSuccessMessage }}</span>
                    </div>

                    <button type="submit" [disabled]="!f.form.valid || isAuthenticating"
                            class="w-full py-3.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:opacity-90 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-2 flex justify-center items-center gap-2">
                        <ng-container *ngIf="!isAuthenticating">
                            <i *ngIf="authView === 'login'" class="fa-solid fa-right-to-bracket"></i>
                            <i *ngIf="authView === 'register'" class="fa-solid fa-user-plus"></i>
                            {{ authView === 'login' ? 'Se connecter' : 'S\\'inscrire' }}
                        </ng-container>
                        <ng-container *ngIf="isAuthenticating">
                            <i class="fa-solid fa-circle-notch fa-spin"></i> {{ authView === 'login' ? 'Connexion...' : 'Inscription...' }}
                        </ng-container>
                    </button>
                </form>

                <p *ngIf="authView === 'login'" class="text-center text-sm text-slate-500 mt-6">
                    Vous n'avez pas de compte ? 
                    <button type="button" (click)="switchAuthView('register')" class="text-[#6366f1] font-bold hover:underline">S'inscrire</button>
                </p>
                <p *ngIf="authView === 'register'" class="text-center text-sm text-slate-500 mt-6">
                    Vous avez déjà un compte ? 
                    <button type="button" (click)="switchAuthView('login')" class="text-[#6366f1] font-bold hover:underline">Se connecter</button>
                </p>
            </div>
        </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow-y: auto;
      background-color: #f8fafc;
    }
  `]
})
export class HomeComponent implements OnInit {
  isAuthModalOpen = false;
  authView: 'login' | 'register' = 'login';
  
  // Auth Form State
  authForm = {
    name: '',
    email: 'admin@expenso.com',
    password: 'admin'
  };
  authErrorMessage = '';
  authSuccessMessage = '';
  isAuthenticating = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  openAuthModal(view: 'login' | 'register'): void {
    this.authView = view;
    this.isAuthModalOpen = true;
    this.authErrorMessage = '';
    this.authSuccessMessage = '';
    
    if (view === 'login') {
        this.authForm.email = 'admin@expenso.com';
        this.authForm.password = 'admin';
    } else {
        this.authForm.name = '';
        this.authForm.email = '';
        this.authForm.password = '';
    }
  }

  closeAuthModal(): void {
    this.isAuthModalOpen = false;
  }

  switchAuthView(view: 'login' | 'register'): void {
    this.authView = view;
    this.authErrorMessage = '';
    this.authSuccessMessage = '';
  }

  onAuthSubmit(): void {
    const { name, email, password } = this.authForm;
    this.isAuthenticating = true;
    this.authErrorMessage = '';
    this.authSuccessMessage = '';

    if (this.authView === 'login') {
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.isAuthenticating = false;
            this.closeAuthModal();
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isAuthenticating = false;
            this.authErrorMessage = "Identifiants incorrects ou serveur indisponible.";
          }
        });
    } else {
        this.authService.register({ name, email, password }).subscribe({
          next: () => {
            this.isAuthenticating = false;
            this.authSuccessMessage = "Inscription réussie ! Vous allez être connecté...";
            // Automatically log in after registration
            setTimeout(() => {
                this.authService.login({ email, password }).subscribe({
                    next: () => {
                        this.closeAuthModal();
                        this.router.navigate(['/dashboard']);
                    }
                });
            }, 1500);
          },
          error: err => {
            this.isAuthenticating = false;
            this.authErrorMessage = err.error || "Erreur lors de l'inscription.";
          }
        });
    }
  }
}
