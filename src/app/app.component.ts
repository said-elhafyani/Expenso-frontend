import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, TransactionType } from './core/services/mock-data.service';
import { AuthService } from './core/services/auth.service';
import { CategoryService } from './core/services/category.service';
import { ExpenseService } from './core/services/expense.service';
import { filter } from 'rxjs/operators';
import { ExpenseRequest } from './core/models/expense.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isModalOpen = false;
  isMobileMenuOpen = false;
  pageTitle = 'Tableau de bord';

  newTransaction = {
    amount: null as number | null,
    date: '',
    category: 'Alimentation',
    reason: '',
    type: 'EXPENSE' as TransactionType,
    note: ''
  };

  get expenseCategories(): string[] {
    return Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'EXPENSE');
  }

  get incomeCategories(): string[] {
    return Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'INCOME');
  }
  currentUser: any = null;
  isDarkTheme = false;

  constructor(
    private mockService: MockDataService,
    private router: Router,
    public authService: AuthService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      if (url.includes('stats')) {
        this.pageTitle = 'Statistiques';
      } else if (url.includes('history')) {
        this.pageTitle = 'Historique des Transactions';
      } else {
        this.pageTitle = 'Tableau de bord';
      }
    });
  }

  ngOnInit() {
    // Initialiser le thème
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.isDarkTheme = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkTheme = false;
      document.documentElement.classList.remove('dark');
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadRealCategories();
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  loadRealCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.mockService.clearCategoryConfig();
        cats.forEach(c => {
          this.mockService.addCategoryConfig(c.name, {
            icon: c.icon || 'fa-tags',
            color: c.color || '#6366f1',
            bg: `bg-[${c.color || '#6366f1'}]/10`,
            text: `text-[${c.color || '#6366f1'}]`,
            type: c.type
          }, c.id);
        });
        // Getters automatically reflect the changes
      },
      error: (err) => console.error('Erreur chargement des catégories:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
    if (!this.newTransaction.date) {
      this.newTransaction.date = new Date().toISOString().split('T')[0];
    }
    if (this.newTransaction.type === 'EXPENSE' && this.expenseCategories.length > 0) {
      this.newTransaction.category = this.expenseCategories[0];
    } else if (this.newTransaction.type === 'INCOME' && this.incomeCategories.length > 0) {
      this.newTransaction.category = this.incomeCategories[0];
    } else {
      this.newTransaction.category = '';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.newTransaction = {
      amount: null,
      date: '',
      category: 'Alimentation',
      reason: '',
      type: 'EXPENSE',
      note: ''
    };
  }

  setType(type: TransactionType) {
    this.newTransaction.type = type;
    if (type === 'EXPENSE' && this.expenseCategories.length > 0) {
      this.newTransaction.category = this.expenseCategories[0];
    } else if (type === 'INCOME' && this.incomeCategories.length > 0) {
      this.newTransaction.category = this.incomeCategories[0];
    } else {
      this.newTransaction.category = '';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.newTransaction.amount && this.newTransaction.date && this.newTransaction.reason) {
      const catConfig = this.mockService.categoryConfig[this.newTransaction.category];
      if (!catConfig || !catConfig.id) {
        console.error('Category ID not found for', this.newTransaction.category);
        return;
      }

      const req: ExpenseRequest = {
        amount: this.newTransaction.amount,
        expenseDate: this.newTransaction.date,
        reason: this.newTransaction.reason,
        note: this.newTransaction.note,
        categoryId: catConfig.id
      };

      this.expenseService.createExpense(req).subscribe({
        next: () => {
          this.mockService.triggerRefresh();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating expense', err);
          alert('Erreur lors de la création de la transaction');
        }
      });
    }
  }
}
