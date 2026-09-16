import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { ExpenseService } from '../../core/services/expense.service';
import { ExpenseResponse } from '../../core/models/expense.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
  allExpenses: ExpenseResponse[] = [];
  filteredExpenses: ExpenseResponse[] = [];
  
  // Dashboard Metrics
  dashBalance = 0;
  dashTotalIncomes = 0;
  dashTotalExpenses = 0;
  dashCount = 0;
  dashAverage = 0;
  
  searchTerm = '';
  typeFilter = 'all';
  catFilter = 'all';
  startDate = '2026-09-01';
  endDate = '2026-09-30';
  
  private sub: Subscription | null = null;
  private refreshSub: Subscription | null = null;
  adminViewUserId: number | null = null;

  constructor(
    public mockService: MockDataService,
    private expenseService: ExpenseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.adminViewUserId = +params['userId'];
      }
      this.loadData();
    });
    
    this.refreshSub = this.mockService.refreshDashboard$.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.sub?.unsubscribe();
    const obs$ = this.adminViewUserId 
      ? this.expenseService.getAdminUserExpenses(this.adminViewUserId)
      : this.expenseService.getAllExpenses();

    this.sub = obs$.subscribe({
      next: (expenses) => {
        this.allExpenses = expenses;
        this.filterHistory();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  filterHistory() {
    const term = this.searchTerm.toLowerCase();
    
    let filtered = this.allExpenses.filter(exp => {
      const matchSearch = exp.reason.toLowerCase().includes(term);
      const matchCat = this.catFilter === 'all' || exp.category?.name === this.catFilter;
      const matchMonth = exp.expenseDate >= this.startDate && exp.expenseDate <= this.endDate;
      const matchType = this.typeFilter === 'all' || exp.category?.type === this.typeFilter;
      return matchSearch && matchCat && matchMonth && matchType;
    });

    this.filteredExpenses = filtered.sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime());
    
    // Calculate metrics based on the filtered data
    this.dashTotalIncomes = this.filteredExpenses.filter(t => t.category?.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
    this.dashTotalExpenses = this.filteredExpenses.filter(t => t.category?.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
    this.dashBalance = this.dashTotalIncomes - this.dashTotalExpenses;
    this.dashCount = this.filteredExpenses.length;
    this.dashAverage = this.dashTotalExpenses > 0 ? this.dashTotalExpenses / 30 : 0; // Keeping the /30 logic from dashboard as an approximation
  }

  deleteExpense(id: number) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      this.expenseService.deleteExpense(id).subscribe({
        next: () => {
          this.mockService.triggerRefresh();
        },
        error: (err) => {
          console.error('Erreur de suppression', err);
          alert('Impossible de supprimer la transaction.');
        }
      });
    }
  }

  getConf(cat: string | undefined) {
    if (!cat) return { icon: 'fa-tags', color: '#6366f1', text: 'text-indigo-500', bg: 'bg-indigo-100' };
    return this.mockService.categoryConfig[cat] || { icon: 'fa-tags', color: '#6366f1', text: 'text-indigo-500', bg: 'bg-indigo-100' };
  }
}
