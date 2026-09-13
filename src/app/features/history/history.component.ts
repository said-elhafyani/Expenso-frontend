import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, MockTransaction } from '../../core/services/mock-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit, OnDestroy {
  allExpenses: MockTransaction[] = [];
  filteredExpenses: MockTransaction[] = [];
  
  searchTerm = '';
  catFilter = 'all';
  monthFilter = '2026-09';
  
  private sub: Subscription | null = null;

  constructor(private mockService: MockDataService) {}

  ngOnInit() {
    this.sub = this.mockService.expenses$.subscribe(expenses => {
      this.allExpenses = expenses;
      this.filterHistory();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  filterHistory() {
    const term = this.searchTerm.toLowerCase();
    
    let filtered = this.allExpenses.filter(exp => {
      const matchSearch = exp.reason.toLowerCase().includes(term);
      const matchCat = this.catFilter === 'all' || exp.category === this.catFilter;
      const matchMonth = exp.date.startsWith(this.monthFilter);
      return matchSearch && matchCat && matchMonth;
    });

    this.filteredExpenses = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  deleteExpense(id: number) {
    if(confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      this.mockService.deleteExpense(id);
    }
  }

  getConf(cat: string) {
    return this.mockService.categoryConfig[cat] || this.mockService.categoryConfig['Autres'];
  }
}
