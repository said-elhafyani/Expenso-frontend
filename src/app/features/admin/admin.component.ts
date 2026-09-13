import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in space-y-6">
        <div class="bg-surface rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <h2 class="text-xl font-bold text-slate-800">Gestion des utilisateurs</h2>
                <p class="text-slate-500 text-sm">Gérez les comptes clients et administrateurs</p>
            </div>
            <button class="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all">
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
  `
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  API_URL = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

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
}
