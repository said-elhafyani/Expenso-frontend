import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, TransactionType } from './core/services/mock-data.service';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

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

  expenseCategories: string[] = [];
  incomeCategories: string[] = [];
  currentUser: any = null;

  constructor(private mockService: MockDataService, private router: Router, public authService: AuthService) {
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
    this.expenseCategories = Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'EXPENSE');
    
    this.incomeCategories = Object.keys(this.mockService.categoryConfig)
      .filter(k => this.mockService.categoryConfig[k].type === 'INCOME');
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
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
    this.newTransaction.category = type === 'EXPENSE' ? 'Alimentation' : 'Salaire';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.newTransaction.amount && this.newTransaction.date && this.newTransaction.reason) {
      this.mockService.addExpense({
        id: Date.now(),
        amount: this.newTransaction.amount,
        date: this.newTransaction.date,
        category: this.newTransaction.category,
        reason: this.newTransaction.reason,
        type: this.newTransaction.type,
        note: this.newTransaction.note
      });
      this.closeModal();
    }
  }
}
