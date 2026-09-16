import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile, ProfileRequest } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-surface dark:bg-transparent rounded-t-[2rem] md:rounded-3xl px-5 py-6 md:p-6 md:border-none md:shadow-none animate-fade-in max-w-2xl mx-auto space-y-6 md:max-w-none">
        <!-- Header Page -->
        <div class="flex justify-between items-start mb-6 mt-2 px-1">
            <div class="flex gap-3">
                <div class="w-12 h-12 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-[1.2rem] flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-display font-bold text-xl mt-1">
                    {{ user?.name?.charAt(0) | uppercase }}
                </div>
                <div>
                    <h1 class="text-[22px] font-display font-bold text-slate-800 dark:text-white leading-tight mt-0.5">Mon Profil</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-[11px] leading-snug mt-1.5 max-w-[180px]">Gérez vos informations personnelles.</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-[1.2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            <form (submit)="saveProfile($event)" class="space-y-8">
                <!-- Informations personnelles -->
                <div>
                    <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <i class="fa-solid fa-user-circle text-indigo-500"></i> Informations Personnelles
                    </h3>
                    
                    <div class="space-y-5">
                        <div>
                            <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nom complet</label>
                            <input type="text" [(ngModel)]="formData.name" name="name" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white outline-none font-semibold"
                                placeholder="Votre nom">
                        </div>
                        
                        <div>
                            <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Adresse Email</label>
                            <input type="email" [value]="user?.email" disabled
                                class="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 cursor-not-allowed transition-all text-sm outline-none font-semibold"
                                title="L'adresse email ne peut pas être modifiée.">
                            <p class="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Identifiant unique, non modifiable.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-100 dark:border-slate-800 pt-8">
                    <h3 class="text-sm font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <i class="fa-solid fa-lock text-amber-500"></i> Sécurité
                    </h3>
                    
                    <div>
                        <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nouveau mot de passe</label>
                        <input type="password" [(ngModel)]="formData.password" name="password"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-white outline-none placeholder-slate-400 dark:placeholder-slate-500 font-semibold"
                            placeholder="Laissez vide pour conserver l'actuel">
                    </div>
                </div>

                <!-- Messages -->
                <div *ngIf="successMsg" class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-start gap-3">
                    <i class="fa-solid fa-circle-check mt-0.5"></i>
                    <p class="text-sm font-bold">{{ successMsg }}</p>
                </div>
                <div *ngIf="errorMsg" class="p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl flex items-start gap-3">
                    <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                    <p class="text-sm font-bold">{{ errorMsg }}</p>
                </div>

                <div class="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                    <button type="submit" [disabled]="isLoading" class="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95 text-sm uppercase tracking-wide">
                        <i *ngIf="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
                        <span *ngIf="!isLoading"><i class="fa-solid fa-check"></i></span>
                        Sauvegarder
                    </button>
                </div>
            </form>
        </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  formData: ProfileRequest = { name: '', password: '' };
  
  isLoading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.formData.name = profile.name;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.errorMsg = 'Impossible de charger le profil.';
      }
    });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const payload: ProfileRequest = {};
    if (this.formData.name && this.formData.name !== this.user?.name) {
      payload.name = this.formData.name;
    }
    if (this.formData.password) {
      payload.password = this.formData.password;
    }

    if (Object.keys(payload).length === 0) {
      this.isLoading = false;
      return; // Rien n'a changé
    }

    this.userService.updateProfile(payload).subscribe({
      next: (updatedProfile) => {
        this.user = updatedProfile;
        this.successMsg = 'Profil mis à jour avec succès.';
        this.formData.password = ''; // Reset password field
        this.isLoading = false;
        
        // Optionnel: Mettre à jour l'utilisateur dans authService si on stockait le nom localement
        const sessionUser = this.authService.getUser();
        if (sessionUser && payload.name) {
            sessionUser.name = payload.name;
            localStorage.setItem('user', JSON.stringify(sessionUser));
        }
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.errorMsg = 'Erreur lors de la mise à jour du profil.';
        this.isLoading = false;
      }
    });
  }
}
