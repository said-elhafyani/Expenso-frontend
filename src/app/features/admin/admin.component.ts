import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bg-surface dark:bg-transparent rounded-t-[2rem] md:rounded-3xl px-5 py-6 md:p-6 md:border-none md:shadow-none animate-fade-in max-w-6xl mx-auto md:max-w-none">
        <!-- Header Page (Nouveau Design Exact) -->
        <div class="flex justify-between items-start mb-6 mt-2 px-1">
            <div class="flex gap-3">
                <div class="w-10 h-10 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1">
                    <i class="fa-solid fa-users-gear text-xl"></i>
                </div>
                <div>
                    <h1 class="text-[22px] font-display font-bold text-slate-800 dark:text-white leading-tight">Gestion des<br>utilisateurs</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-[11px] leading-snug mt-1.5 max-w-[180px]">Gérez les comptes clients et administrateurs.</p>
                </div>
            </div>
            <button (click)="openModal()" class="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:opacity-90 text-white font-bold transition-all shadow-[0_8px_20px_rgba(139,92,246,0.3)] dark:shadow-[0_8px_20px_rgba(139,92,246,0.2)] flex items-center gap-2 px-4 py-3 rounded-[1rem] flex-shrink-0 text-sm mt-1">
                <i class="fa-solid fa-plus font-normal"></i>
                <span class="text-left text-xs leading-tight">Nouvel<br>utilisateur</span>
            </button>
        </div>

        <!-- Table Desktop -->
        <div class="hidden md:block glass-panel rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700/50">
                            <th class="px-6 py-5">ID</th>
                            <th class="px-6 py-5">Nom complet</th>
                            <th class="px-6 py-5">Email</th>
                            <th class="px-6 py-5">Rôle</th>
                            <th class="px-6 py-5">Solde</th>
                            <th class="px-6 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr *ngFor="let user of users" class="border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">#{{ user.id }}</td>
                            <td class="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{{ user.name }}</td>
                            <td class="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{{ user.email }}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-md text-xs font-bold inline-block"
                                      [ngClass]="user.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500'">
                                    {{ user.role === 'ADMIN' ? 'Administrateur' : 'Client' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-display font-bold" [ngClass]="user.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                                {{ user.balance | number:'1.2-2' }} DH
                            </td>
                            <td class="px-6 py-4 flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <ng-container *ngIf="user.email !== currentUserEmail">
                                    <button (click)="openEditModal(user)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shadow-sm" title="Modifier">
                                        <i class="fa-solid fa-pen text-xs"></i>
                                    </button>
                                    <a [routerLink]="['/history']" [queryParams]="{userId: user.id}" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shadow-sm" title="Historique">
                                        <i class="fa-solid fa-clock-rotate-left text-xs"></i>
                                    </a>
                                    <button *ngIf="user.role !== 'ADMIN'" (click)="makeAdmin(user.id)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shadow-sm" title="Rendre Admin">
                                        <i class="fa-solid fa-star text-xs"></i>
                                    </button>
                                    <button *ngIf="user.role === 'ADMIN'" (click)="makeUser(user.id)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center transition-colors shadow-sm" title="Rétrograder en Client">
                                        <i class="fa-solid fa-arrow-down text-xs"></i>
                                    </button>
                                    <button (click)="deleteUser(user.id)" class="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors shadow-sm" title="Supprimer">
                                        <i class="fa-solid fa-trash-can text-xs"></i>
                                    </button>
                                </ng-container>
                                <span *ngIf="user.email === currentUserEmail" class="text-xs text-slate-400 dark:text-slate-500 italic mt-2 font-medium">C'est vous</span>
                            </td>
                        </tr>
                        <tr *ngIf="users.length === 0">
                            <td colspan="6" class="px-6 py-16 text-center text-slate-500 dark:text-slate-400 font-medium">
                                <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Chargement des utilisateurs...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Vue Mobile (Cartes) -->
        <div class="md:hidden flex flex-col gap-3">
            <div *ngFor="let user of users" class="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                            {{ user.name.charAt(0) | uppercase }}
                        </div>
                        <div>
                            <p class="font-bold text-slate-800 dark:text-white leading-tight">{{ user.name }}</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          [ngClass]="user.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-500'">
                        {{ user.role === 'ADMIN' ? 'Admin' : 'Client' }}
                    </span>
                </div>
                
                <div class="flex justify-between items-end mb-4">
                    <div>
                        <p class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">Solde Actuel</p>
                        <p class="font-display font-bold text-lg" [ngClass]="user.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                            {{ user.balance | number:'1.2-2' }} DH
                        </p>
                    </div>
                    <p class="text-xs text-slate-400 dark:text-slate-500">ID: #{{ user.id }}</p>
                </div>
                
                <!-- Actions Mobile -->
                <div class="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex gap-2 justify-end">
                    <ng-container *ngIf="user.email !== currentUserEmail">
                        <button (click)="openEditModal(user)" class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors" title="Modifier">
                            <i class="fa-solid fa-pen text-sm"></i>
                        </button>
                        <a [routerLink]="['/history']" [queryParams]="{userId: user.id}" class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-colors" title="Historique">
                            <i class="fa-solid fa-clock-rotate-left text-sm"></i>
                        </a>
                        <button *ngIf="user.role !== 'ADMIN'" (click)="makeAdmin(user.id)" class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 flex items-center justify-center transition-colors" title="Rendre Admin">
                            <i class="fa-solid fa-star text-sm"></i>
                        </button>
                        <button *ngIf="user.role === 'ADMIN'" (click)="makeUser(user.id)" class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors" title="Rétrograder en Client">
                            <i class="fa-solid fa-arrow-down text-sm"></i>
                        </button>
                        <button (click)="deleteUser(user.id)" class="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center transition-colors" title="Supprimer">
                            <i class="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </ng-container>
                    <span *ngIf="user.email === currentUserEmail" class="w-full text-center text-xs text-slate-400 dark:text-slate-500 font-medium py-1.5">
                        C'est vous
                    </span>
                </div>
            </div>
            
            <div *ngIf="users.length === 0" class="text-center py-10 text-slate-500 dark:text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p class="text-sm">Chargement des utilisateurs...</p>
            </div>
        </div>
    </div>

    <!-- Modal Nouvel Utilisateur (Bottom Sheet on Mobile) -->
    <div class="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-end md:items-center justify-center md:p-4 transition-opacity duration-300"
         [class.hidden]="!isModalOpen"
         [class.opacity-0]="!isModalOpen"
         [class.pointer-events-none]="!isModalOpen"
         (click)="closeModal()">
        
        <div class="bg-white dark:bg-slate-900 w-full max-w-md overflow-hidden transform transition-all duration-300 border border-transparent dark:border-slate-800
                    rounded-t-[2rem] md:rounded-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.1)] md:shadow-2xl 
                    max-h-[90vh] flex flex-col"
             [ngClass]="isModalOpen ? 'translate-y-0 md:scale-100' : 'translate-y-full md:translate-y-0 md:scale-95'"
             (click)="$event.stopPropagation()">
            
            <!-- Drag Handle (Mobile Only) -->
            <div class="w-full flex justify-center pt-3 pb-1 md:hidden bg-slate-50 dark:bg-slate-800/50">
                <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
            </div>

            <div class="px-5 md:px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                <h3 class="text-xl font-display font-bold text-slate-800 dark:text-white">{{ editingUserId ? "Modifier l'utilisateur" : "Créer un utilisateur" }}</h3>
                <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors shadow-sm">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <form (submit)="saveUser($event)" class="p-5 md:p-6 overflow-y-auto">
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nom complet</label>
                        <input type="text" [(ngModel)]="newUser.name" name="name" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                            placeholder="John Doe">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Adresse Email</label>
                        <input type="email" [(ngModel)]="newUser.email" name="email" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                            placeholder="john@example.com">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mot de passe</label>
                        <input type="password" [(ngModel)]="newUser.password" name="password" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                            placeholder="Min. 6 caractères">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Rôle</label>
                        <div class="relative">
                            <select [(ngModel)]="newUser.role" name="role" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30 transition-all text-sm appearance-none bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none cursor-pointer">
                                <option value="USER">Client</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex gap-3">
                    <button type="button" (click)="closeModal()" class="w-1/3 py-3.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" class="w-2/3 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-800/50 flex justify-center items-center transform active:scale-95">
                        {{ editingUserId ? 'Enregistrer' : 'Créer le compte' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  API_URL = environment.apiUrl + '/admin/users';
  AUTH_API_URL = environment.apiUrl + '/auth/register';
  // POST to API_URL directly creates users, but we modified AdminController to do this!
  // Wait, I updated AdminController's @PostMapping to `POST /api/admin/users`. So let's use API_URL!

  isModalOpen = false;
  editingUserId: number | null = null;
  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'USER'
  };

  currentUserEmail: string = '';

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getUser()?.email || '';
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: data => this.users = data,
      error: err => console.error('Error fetching users', err)
    });
  }

  makeAdmin(id: number): void {
    this.http.put(`${this.API_URL}/${id}/role?role=ADMIN`, {}).subscribe(() => this.loadUsers());
  }

  makeUser(id: number): void {
    this.http.put(`${this.API_URL}/${id}/role?role=USER`, {}).subscribe(() => this.loadUsers());
  }

  deleteUser(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.http.delete(`${this.API_URL}/${id}`).subscribe(() => this.loadUsers());
    }
  }

  openModal() {
    this.editingUserId = null;
    this.newUser = { name: '', email: '', password: '', role: 'USER' };
    this.isModalOpen = true;
  }

  openEditModal(user: any) {
    this.editingUserId = user.id;
    this.newUser = { name: user.name, email: user.email, password: '', role: user.role };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingUserId = null;
    this.newUser = { name: '', email: '', password: '', role: 'USER' };
  }

  saveUser(event: Event) {
    event.preventDefault();
    if (this.editingUserId) {
      // Modifying existing user
      if (this.newUser.name && this.newUser.email) {
        this.http.put(`${this.API_URL}/${this.editingUserId}`, this.newUser, { responseType: 'text' }).subscribe({
          next: (res) => {
            this.closeModal();
            this.loadUsers();
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de la modification de l'utilisateur : " + err.error);
          }
        });
      }
    } else {
      // Creating new user
      if (this.newUser.name && this.newUser.email && this.newUser.password) {
        this.http.post(this.API_URL, this.newUser, { responseType: 'text' }).subscribe({
          next: (res) => {
            this.closeModal();
            this.loadUsers();
          },
          error: (err) => {
            console.error(err);
            alert("Erreur lors de la création de l'utilisateur : " + err.error);
          }
        });
      }
    }
  }
}
