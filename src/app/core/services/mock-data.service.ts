import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface MockTransaction {
  id: number;
  amount: number;
  date: string;
  category: string;
  reason: string;
  type: TransactionType;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
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
    'Logement': { icon: 'fa-house', color: '#8b5cf6', bg: 'bg-purple-100', text: 'text-purple-500', type: 'EXPENSE' },
    'Loisirs': { icon: 'fa-film', color: '#ec4899', bg: 'bg-pink-100', text: 'text-pink-500', type: 'EXPENSE' },
    'Shopping': { icon: 'fa-bag-shopping', color: '#14b8a6', bg: 'bg-teal-100', text: 'text-teal-500', type: 'EXPENSE' },
    'Autres': { icon: 'fa-box', color: '#64748b', bg: 'bg-slate-100', text: 'text-slate-500', type: 'EXPENSE' },
    
    // Revenus
    'Salaire': { icon: 'fa-money-bill-wave', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Virement': { icon: 'fa-building-columns', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Cadeau': { icon: 'fa-gift', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' },
    'Autres revenus': { icon: 'fa-coins', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-500', type: 'INCOME' }
  };

  private expensesSource = new BehaviorSubject<MockTransaction[]>([
    // Revenus Septembre
    { id: 101, amount: 8000.00, date: '2026-09-01', category: 'Salaire', reason: 'Salaire de Septembre', type: 'INCOME' },
    { id: 102, amount: 500.00, date: '2026-09-10', category: 'Cadeau', reason: 'Anniversaire', type: 'INCOME' },
    
    // Dépenses Septembre
    { id: 1, amount: 250.00, date: '2026-09-12', category: 'Alimentation', reason: 'Restaurant', type: 'EXPENSE' },
    { id: 2, amount: 80.00, date: '2026-09-12', category: 'Loisirs', reason: 'Cinéma', type: 'EXPENSE' },
    { id: 3, amount: 300.00, date: '2026-09-08', category: 'Transport', reason: 'Carburant', type: 'EXPENSE' },
    { id: 4, amount: 350.00, date: '2026-09-05', category: 'Alimentation', reason: 'Marjane', type: 'EXPENSE' },
    { id: 5, amount: 800.00, date: '2026-09-02', category: 'Logement', reason: 'Électricité & Eau', type: 'EXPENSE' },
    { id: 6, amount: 150.00, date: '2026-09-01', category: 'Shopping', reason: 'Zara', type: 'EXPENSE' },
    
    // Revenus Août
    { id: 103, amount: 8000.00, date: '2026-08-01', category: 'Salaire', reason: 'Salaire de Août', type: 'INCOME' },

    // Dépenses Août
    { id: 7, amount: 2000.00, date: '2026-08-15', category: 'Loisirs', reason: 'Vacances', type: 'EXPENSE' },
    { id: 8, amount: 450.00, date: '2026-08-10', category: 'Alimentation', reason: 'Supermarché', type: 'EXPENSE' },
    { id: 9, amount: 800.00, date: '2026-08-05', category: 'Logement', reason: 'Factures', type: 'EXPENSE' },
    
    // Revenus Juillet
    { id: 104, amount: 8000.00, date: '2026-07-01', category: 'Salaire', reason: 'Salaire de Juillet', type: 'INCOME' },

    // Dépenses Juillet
    { id: 10, amount: 1200.00, date: '2026-07-20', category: 'Transport', reason: 'Billet Avion', type: 'EXPENSE' },
    { id: 11, amount: 500.00, date: '2026-07-15', category: 'Shopping', reason: 'Soldes', type: 'EXPENSE' }
  ]);

  expenses$ = this.expensesSource.asObservable();

  getExpenses() {
    return this.expensesSource.getValue();
  }

  addExpense(expense: MockTransaction) {
    const current = this.getExpenses();
    this.expensesSource.next([...current, expense]);
  }

  deleteExpense(id: number) {
    const current = this.getExpenses();
    this.expensesSource.next(current.filter(e => e.id !== id));
  }
}
