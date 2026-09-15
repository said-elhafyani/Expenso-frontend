import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { ExpenseService } from '../../core/services/expense.service';
import { ExpenseResponse } from '../../core/models/expense.model';
import { Subscription } from 'rxjs';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  
  // Vue dashboard global
  dashTotalExpenses = 0;
  dashTotalIncomes = 0;
  dashBalance = 0;
  dashAverage = 0;
  dashCount = 0;
  
  // Filtres d'analyse détaillée
  selectedType = 'EXPENSE';
  startDate = '2026-09-01';
  endDate = '2026-09-30';
  selectedCategory = 'all';
  get expenseCategories(): string[] {
    return Object.keys(this.mockService.categoryConfig)
        .filter(k => this.mockService.categoryConfig[k].type === 'EXPENSE');
  }

  get incomeCategories(): string[] {
    return Object.keys(this.mockService.categoryConfig)
        .filter(k => this.mockService.categoryConfig[k].type === 'INCOME');
  }
  
  // Données filtrées pour le graphe
  filteredSum = 0;
  categoryTotals: {category: string, amount: number, pct: number, color: string}[] = [];
  
  chartColors = [
    '#6366f1', '#10b981', '#f59e0b', '#ec4899', 
    '#3b82f6', '#8b5cf6', '#14b8a6', '#ef4444', 
    '#f97316', '#0ea5e9', '#84cc16', '#eab308'
  ];
  
  recentTransactions: ExpenseResponse[] = [];
  
  myChart: any = null;
  private sub: Subscription | null = null;
  private refreshSub: Subscription | null = null;
  private allTransactions: ExpenseResponse[] = [];

  constructor(
    public mockService: MockDataService, 
    private decimalPipe: DecimalPipe,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    // Getters handle the categories dynamically

    this.loadData();
    this.refreshSub = this.mockService.refreshDashboard$.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.sub?.unsubscribe();
    this.sub = this.expenseService.getAllExpenses().subscribe({
      next: (transactions) => {
        this.allTransactions = transactions;
        this.calculateDashboardGlobals();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement des dépenses', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateChart(), 100);
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
    if(this.refreshSub) this.refreshSub.unsubscribe();
    if(this.myChart) this.myChart.destroy();
  }

  // Calcule les indicateurs globaux du mois courant
  calculateDashboardGlobals() {
    const CURRENT_MONTH = '2026-09';
    
    // Calcul du Solde Actuel (tous les mois)
    const allIncomes = this.allTransactions.filter(t => t.category?.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const allExpenses = this.allTransactions.filter(t => t.category?.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    this.dashBalance = allIncomes - allExpenses;

    const currentTransactions = this.allTransactions.filter(e => e.expenseDate.startsWith(CURRENT_MONTH));
    const currentExpenses = currentTransactions.filter(e => e.category?.type === 'EXPENSE');
    const currentIncomes = currentTransactions.filter(e => e.category?.type === 'INCOME');
    
    this.dashTotalExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
    this.dashTotalIncomes = currentIncomes.reduce((sum, e) => sum + e.amount, 0);
    this.dashAverage = this.dashTotalExpenses / 30; // Moyenne de dépense par jour
    this.dashCount = currentTransactions.length;

    // Recent 4 (toutes transactions du mois)
    this.recentTransactions = [...currentTransactions]
      .sort((a,b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
      .slice(0, 4);
  }

  // Applique les filtres sur la section Analyse
  onFilterChange() {
    this.applyFilters();
  }

  onTypeChange() {
    this.selectedCategory = 'all';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = this.allTransactions.filter(t => t.expenseDate >= this.startDate && t.expenseDate <= this.endDate);
    filtered = filtered.filter(t => t.category?.type === this.selectedType);
    
    if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(t => t.category?.name === this.selectedCategory);
    }
    
    this.filteredSum = filtered.reduce((sum, t) => sum + t.amount, 0);

    const catMap = new Map<string, number>();
    filtered.forEach(e => {
      const catName = e.category?.name || 'Inconnu';
      catMap.set(catName, (catMap.get(catName) || 0) + e.amount);
    });
    
    const entries = Array.from(catMap.entries()).sort((a,b) => b[1] - a[1]);
    
    this.categoryTotals = entries.map(([cat, amount], index) => ({ 
          category: cat, 
          amount, 
          pct: this.filteredSum > 0 ? (amount/this.filteredSum)*100 : 0,
          color: this.chartColors[index % this.chartColors.length]
      }));

    if (this.myChart) {
      this.updateChart();
    }
  }

  updateChart() {
    if (typeof Chart === 'undefined') return;

    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const labels = this.categoryTotals.map(c => c.category);
    const amounts = this.categoryTotals.map(c => c.amount);
    const bgColors = this.categoryTotals.map(c => c.color);

    if (this.myChart) {
        this.myChart.data.labels = labels;
        this.myChart.data.datasets[0].data = amounts;
        this.myChart.data.datasets[0].backgroundColor = bgColors;
        this.myChart.update();
    } else {
        this.myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: amounts,
                    backgroundColor: bgColors,
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context: any) => {
                                let label = context.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed !== null) {
                                    label += this.formatMoney(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount).replace('MAD', 'DH');
  }

  getConf(cat: string | undefined) {
    if (!cat) return { icon: 'fa-tags', color: '#6366f1', text: 'text-indigo-500', bg: 'bg-indigo-100' };
    return this.mockService.categoryConfig[cat] || { icon: 'fa-tags', color: '#6366f1', text: 'text-indigo-500', bg: 'bg-indigo-100' };
  }
}
