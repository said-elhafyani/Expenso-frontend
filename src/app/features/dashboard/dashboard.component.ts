import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MockDataService, MockTransaction } from '../../core/services/mock-data.service';
import { Subscription } from 'rxjs';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DecimalPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  
  // Vue dashboard
  dashTotalExpenses = 0;
  dashTotalIncomes = 0;
  dashBalance = 0;
  dashAverage = 0;
  dashCount = 0;
  
  categoryTotals: {category: string, amount: number, pct: number}[] = [];
  recentTransactions: MockTransaction[] = [];
  
  myChart: any = null;
  private sub: Subscription | null = null;

  constructor(public mockService: MockDataService, private decimalPipe: DecimalPipe) {}

  ngOnInit(): void {
    this.sub = this.mockService.expenses$.subscribe(transactions => {
      this.calculateDashboard(transactions);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateChart(), 100);
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
    if(this.myChart) this.myChart.destroy();
  }

  calculateDashboard(allTransactions: MockTransaction[]) {
    const CURRENT_MONTH = '2026-09';
    
    // Calcul du Solde Actuel (tous les mois)
    const allIncomes = allTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    const allExpenses = allTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    this.dashBalance = allIncomes - allExpenses;

    const currentTransactions = allTransactions.filter(e => e.date.startsWith(CURRENT_MONTH));
    const currentExpenses = currentTransactions.filter(e => e.type === 'EXPENSE');
    const currentIncomes = currentTransactions.filter(e => e.type === 'INCOME');
    
    this.dashTotalExpenses = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
    this.dashTotalIncomes = currentIncomes.reduce((sum, e) => sum + e.amount, 0);
    this.dashAverage = this.dashTotalExpenses / 30; // Moyenne de dépense par jour
    this.dashCount = currentTransactions.length;

    // Categories (seulement les dépenses pour le graphe)
    const catMap = new Map<string, number>();
    currentExpenses.forEach(e => {
      catMap.set(e.category, (catMap.get(e.category) || 0) + e.amount);
    });
    
    this.categoryTotals = Array.from(catMap.entries())
      .map(([cat, amount]) => ({ category: cat, amount, pct: (amount/this.dashTotalExpenses)*100 }))
      .sort((a,b) => b.amount - a.amount);

    // Recent 4 (toutes transactions)
    this.recentTransactions = [...currentTransactions]
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

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
    const bgColors = labels.map(label => this.mockService.categoryConfig[label]?.color || '#cbd5e1');

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
                    borderWidth: 0,
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

  getConf(cat: string) {
    return this.mockService.categoryConfig[cat] || this.mockService.categoryConfig['Autres'];
  }
}
