import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface MockTransaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  reason: string;
  type: TransactionType;
  note?: string;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  expenses$: Observable<MockTransaction[]>;
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  
  public refreshDashboard$ = this.refreshTrigger.asObservable();

  triggerRefresh() {
    this.refreshTrigger.next();
  }

  constructor(private authService: AuthService) {
    this.expenses$ = combineLatest([this.expensesSource, this.authService.currentUser$]).pipe(
      map(([expenses, user]) => {
        if (!user) return [];
        // Si la transaction n'a pas d'email, c'est une donnée de démo (on peut la montrer à tout le monde ou juste admin)
        // Pour isoler complètement, on dit que la démo = admin
        return expenses.filter(e => {
          if (e.userEmail) {
            return e.userEmail === user.email;
          }
          // Par défaut, les fausses données vont à admin@expenso.com
          return user.email === 'admin@expenso.com';
        });
      })
    );
  }

  globalBudget = 6000.00;

  categoryBudgets: Record<string, number> = {
    'Alimentation': 2000,
    'Logement': 1500,
    'Transport': 1000,
    'Loisirs': 500,
    'Shopping': 500,
    'Autres': 500
  };

  categoryConfig: Record<string, any> = {
    // Dépenses
    'Alimentation': { icon: 'fa-utensils', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-500', type: 'EXPENSE' },
    'Transport': { icon: 'fa-car', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-500', type: 'EXPENSE' },
    'Logement': { icon: 'fa-house', color: '#14b8a6', bg: 'bg-teal-100', text: 'text-teal-500', type: 'EXPENSE' },
    'Loisirs': { icon: 'fa-film', color: '#ec4899', bg: 'bg-pink-100', text: 'text-pink-500', type: 'EXPENSE' },
    'Shopping': { icon: 'fa-cart-shopping', color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-500', type: 'EXPENSE' },
    'Autres': { icon: 'fa-box', color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-500', type: 'EXPENSE' },
    
    // Revenus
    'Salaire': { icon: 'fa-money-bill-wave', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Virement': { icon: 'fa-building-columns', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Cadeau': { icon: 'fa-gift', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Autres revenus': { icon: 'fa-coins', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' }
  };

  private expensesSource = new BehaviorSubject<MockTransaction[]>([]);

  getExpenses() {
    const user = this.authService.getUser();
    if (!user) return [];
    return this.expensesSource.getValue().filter(e => {
        if (e.userEmail) return e.userEmail === user.email;
        return user.email === 'admin@expenso.com';
    });
  }

  addExpense(expense: MockTransaction) {
    const user = this.authService.getUser();
    if (user) {
      expense.userEmail = user.email;
    }
    const current = this.expensesSource.getValue();
    this.expensesSource.next([...current, expense]);
  }

  deleteExpense(id: number) {
    const current = this.expensesSource.getValue();
    this.expensesSource.next(current.filter(e => e.id !== id));
  }

  addCategoryConfig(name: string, config: any, id?: number) {
    this.categoryConfig[name] = { ...config, id };
  }

  deleteCategoryConfig(name: string) {
    delete this.categoryConfig[name];
  }

  clearCategoryConfig() {
    this.categoryConfig = {};
  }
}
