import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, MockTransaction } from '../../core/services/mock-data.service';
import { Subscription } from 'rxjs';

declare var Chart: any;

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DecimalPipe],
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {
  activeTab: 'global' | 'analysis' | 'budgets' = 'global';

  // Stats Annuelles (Vue Globale)
  totalYearly = 0;
  monthlyAvg = 0;
  maxMonth = '-';
  topCategory = '-';
  monthlyData: number[] = new Array(12).fill(0);

  // Filtres d'Analyse Détaillée
  months = [
    { value: 'all', label: 'Tous les mois (2026)' },
    { value: '2026-09', label: 'Septembre 2026' },
    { value: '2026-08', label: 'Août 2026' },
    { value: '2026-07', label: 'Juillet 2026' }
  ];
  expenseCategories: string[] = [];
  incomeCategories: string[] = [];
  selectedType: 'EXPENSE' | 'INCOME' = 'EXPENSE';
  selectedMonth = '2026-09';
  selectedCategory = 'all';
  filteredSum = 0;
  filteredCategoryTotals: {category: string, amount: number, pct: number, color: string}[] = [];

  // Budgets par catégorie
  globalBudget = 0;
  totalSpent = 0;
  globalPct = 0;
  catBudgets: any[] = [];
  
  private sub: Subscription | null = null;
  private barChart: any = null;
  private pieChart: any = null;
  private allTransactions: MockTransaction[] = [];

  constructor(public mockService: MockDataService, private decimalPipe: DecimalPipe) {}

  ngOnInit() {
    this.expenseCategories = Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'EXPENSE');
    
    this.incomeCategories = Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'INCOME');
    
    this.globalBudget = this.mockService.globalBudget;

    this.sub = this.mockService.expenses$.subscribe(expenses => {
      this.allTransactions = expenses;
      this.calculateStats(expenses);
      this.calculateBudgets(expenses);
      this.updateFilteredSum();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderActiveCharts(), 100);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    this.destroyCharts();
  }

  setTab(tab: 'global' | 'analysis' | 'budgets') {
    this.activeTab = tab;
    setTimeout(() => this.renderActiveCharts(), 100);
  }

  calculateStats(expenses: MockTransaction[]) {
    this.monthlyData = new Array(12).fill(0);
    this.totalYearly = 0;
    const catTotals: Record<string, number> = {};

    expenses.forEach(exp => {
      if (exp.date.startsWith('2026') && exp.type === 'EXPENSE') {
        this.totalYearly += exp.amount;
        const monthIndex = parseInt(exp.date.split('-')[1]) - 1;
        this.monthlyData[monthIndex] += exp.amount;
        
        catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
      }
    });

    this.monthlyAvg = this.totalYearly / 9; // basé sur 9 mois jusqu'à septembre
    const maxMonthValue = Math.max(...this.monthlyData);
    const maxMonthIndex = this.monthlyData.indexOf(maxMonthValue);
    const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    this.maxMonth = maxMonthValue > 0 ? monthLabels[maxMonthIndex] : '-';
    this.topCategory = Object.keys(catTotals).reduce((a, b) => (catTotals[a] || 0) > (catTotals[b] || 0) ? a : b, '-');

    if (this.activeTab === 'global') this.renderActiveCharts();
  }

  calculateBudgets(expenses: MockTransaction[]) {
    const currentExpenses = expenses.filter(e => e.date.startsWith('2026-09') && e.type === 'EXPENSE');
    this.totalSpent = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
    this.globalPct = Math.min((this.totalSpent / this.globalBudget) * 100, 100);

    const catSpent: Record<string, number> = {};
    currentExpenses.forEach(e => {
      catSpent[e.category] = (catSpent[e.category] || 0) + e.amount;
    });

    this.catBudgets = Object.keys(this.mockService.categoryBudgets).map(cat => {
      const limit = this.mockService.categoryBudgets[cat];
      const spent = catSpent[cat] || 0;
      const pct = Math.min((spent / limit) * 100, 100);
      return {
        name: cat,
        limit,
        spent,
        pct,
        isWarning: pct > 85,
        conf: this.mockService.categoryConfig[cat] || this.mockService.categoryConfig['Autres']
      };
    });
  }

  updateFilteredSum() {
    let filtered = this.allTransactions.filter(t => t.type === this.selectedType);
    if (this.selectedMonth !== 'all') {
      filtered = filtered.filter(t => t.date.startsWith(this.selectedMonth));
    }
    
    // Pour le graphique, on calcule la répartition par catégorie
    const catMap = new Map<string, number>();
    filtered.forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
    });

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }
    this.filteredSum = filtered.reduce((sum, t) => sum + t.amount, 0);

    // Préparation des données pour le Pie Chart
    const totalForPie = Array.from(catMap.values()).reduce((a,b)=>a+b, 0);
    this.filteredCategoryTotals = Array.from(catMap.entries())
      .map(([cat, amount]) => ({ 
        category: cat, 
        amount, 
        pct: totalForPie > 0 ? (amount/totalForPie)*100 : 0,
        color: this.mockService.categoryConfig[cat]?.color || '#cbd5e1'
      }))
      .sort((a,b) => b.amount - a.amount);

    if (this.activeTab === 'analysis') this.renderActiveCharts();
  }

  onFilterChange() {
    this.updateFilteredSum();
  }

  onTypeChange() {
    this.selectedCategory = 'all';
    this.updateFilteredSum();
  }

  getGlobalBarClass(): string {
    if (this.globalPct > 90) return 'bg-red-400';
    if (this.globalPct > 75) return 'bg-amber-400';
    return 'bg-emerald-400';
  }

  formatMoney(amount: number): string {
    return this.decimalPipe.transform(amount, '1.2-2') + ' DH';
  }

  destroyCharts() {
    if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
    if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
  }

  renderActiveCharts() {
    if (typeof Chart === 'undefined') return;
    this.destroyCharts();

    if (this.activeTab === 'global') {
      const canvas = document.getElementById('yearlyChart') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Dépenses',
                data: this.monthlyData,
                backgroundColor: '#4f46e5',
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [4, 4] } },
                x: { grid: { display: false } }
            }
        }
      });
    }

    if (this.activeTab === 'analysis') {
      const canvas = document.getElementById('analysisPieChart') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const labels = this.filteredCategoryTotals.map(c => c.category);
      const data = this.filteredCategoryTotals.map(c => c.amount);
      const bgColors = this.filteredCategoryTotals.map(c => c.color);

      this.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: { 
              legend: { display: false },
              tooltip: {
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  padding: 12, cornerRadius: 8,
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
}
