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
    <div class="max-w-2xl mx-auto animate-fade-in space-y-6">
        <div class="bg-surface rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-inner font-bold">
                {{ user?.name?.charAt(0) | uppercase }}
            </div>
            <div>
                <h2 class="text-xl font-bold text-slate-800">Mon Profil</h2>
                <p class="text-slate-500 text-sm">Gérez vos informations personnelles et paramètres de sécurité</p>
            </div>
        </div>

        <div class="bg-surface rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <form (submit)="saveProfile($event)" class="space-y-6">
                <!-- Informations personnelles -->
                <div>
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-user-circle text-primary"></i> Informations Personnelles
                    </h3>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                            <input type="text" [(ngModel)]="formData.name" name="name" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                placeholder="Votre nom">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                            <input type="email" [value]="user?.email" disabled
                                class="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed transition-all text-sm"
                                title="L'adresse email ne peut pas être modifiée.">
                            <p class="mt-1 text-xs text-slate-400">Votre adresse email sert d'identifiant et ne peut pas être modifiée ici.</p>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-100 pt-6">
                    <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-lock text-amber-500"></i> Sécurité
                    </h3>
                    
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                        <input type="password" [(ngModel)]="formData.password" name="password"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            placeholder="Laissez vide pour conserver l'actuel">
                    </div>
                </div>

                <!-- Messages -->
                <div *ngIf="successMsg" class="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-3">
                    <i class="fa-solid fa-circle-check mt-0.5"></i>
                    <p class="text-sm font-medium">{{ successMsg }}</p>
                </div>
                <div *ngIf="errorMsg" class="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
                    <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                    <p class="text-sm font-medium">{{ errorMsg }}</p>
                </div>

                <div class="flex justify-end pt-4 border-t border-slate-100">
                    <button type="submit" [disabled]="isLoading" class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <i *ngIf="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
                        Sauvegarder les modifications
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
