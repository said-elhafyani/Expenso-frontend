import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in space-y-6">
        <div class="bg-surface rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Gestion des utilisateurs</h2>
                <p class="text-slate-500 text-sm">Gérez les comptes clients et administrateurs</p>
            </div>
            <button (click)="openModal()" class="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all">
                <i class="fa-solid fa-plus mr-2"></i> Nouvel utilisateur
            </button>
        </div>

        <div class="bg-surface rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                            <th class="px-6 py-4 font-medium">ID</th>
                            <th class="px-6 py-4 font-medium">Nom complet</th>
                            <th class="px-6 py-4 font-medium">Email</th>
                            <th class="px-6 py-4 font-medium">Rôle</th>
                            <th class="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let user of users" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4 text-slate-500">#{{ user.id }}</td>
                            <td class="px-6 py-4 font-medium text-slate-800">{{ user.name }}</td>
                            <td class="px-6 py-4 text-slate-500">{{ user.email }}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-bold"
                                      [ngClass]="user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'">
                                    {{ user.role === 'ADMIN' ? 'Administrateur' : 'Client' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 flex justify-end gap-2">
                                <button *ngIf="user.role !== 'ADMIN'" (click)="makeAdmin(user.id)" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors" title="Rendre Admin">
                                    <i class="fa-solid fa-star"></i>
                                </button>
                                <button *ngIf="user.role === 'ADMIN'" (click)="makeUser(user.id)" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors" title="Rétrograder en Client">
                                    <i class="fa-solid fa-arrow-down"></i>
                                </button>
                                <button (click)="deleteUser(user.id)" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors" title="Supprimer">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </td>
                        </tr>
                        <tr *ngIf="users.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                                <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Chargement des utilisateurs...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal Nouvel Utilisateur -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" (click)="closeModal()"></div>
        <div class="relative bg-white rounded-3xl w-full max-w-md mx-4 shadow-xl overflow-hidden animate-slide-up">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 class="text-lg font-bold text-slate-800">Créer un utilisateur</h3>
                <button (click)="closeModal()" class="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <form (submit)="createUser($event)" class="p-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                        <input type="text" [(ngModel)]="newUser.name" name="name" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            placeholder="John Doe">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Adresse Email</label>
                        <input type="email" [(ngModel)]="newUser.email" name="email" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            placeholder="john@example.com">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                        <input type="password" [(ngModel)]="newUser.password" name="password" required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            placeholder="Min. 6 caractères">
                    </div>
                </div>

                <div class="mt-8 flex gap-3">
                    <button type="button" (click)="closeModal()" class="flex-1 py-3 px-4 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" class="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-primary hover:bg-primary-dark transition-colors shadow-md shadow-indigo-200">
                        Créer le compte
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

  isModalOpen = false;
  newUser = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newUser = { name: '', email: '', password: '' };
  }

  createUser(event: Event) {
    event.preventDefault();
    if (this.newUser.name && this.newUser.email && this.newUser.password) {
      this.http.post(this.AUTH_API_URL, this.newUser, { responseType: 'text' }).subscribe({
        next: (res) => {
          this.closeModal();
          this.loadUsers();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la création de l\'utilisateur : ' + err.error);
        }
      });
    }
  }
}
