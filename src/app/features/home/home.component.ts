import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  showAuthModal = false;
  authMode: 'login' | 'register' = 'login';
  loading = false;
  error = '';
  isScrolled = false;
  isDarkTheme = true;
  isMobileMenuOpen = false;
  
  authData = {
    name: '',
    email: '',
    password: ''
  };

  private observer: IntersectionObserver | null = null;

  constructor(private authService: AuthService, private router: Router, private el: ElementRef) {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    // Restore theme preference
    const saved = localStorage.getItem('expenso-theme');
    this.isDarkTheme = saved ? saved === 'dark' : true;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('expenso-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  ngAfterViewInit() {
    // Intersection Observer for scroll-reveal animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      const elements = this.el.nativeElement.querySelectorAll('.reveal');
      elements.forEach((el: Element) => this.observer?.observe(el));
    }, 100);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  openAuthModal(mode: 'login' | 'register') {
    this.authMode = mode;
    this.showAuthModal = true;
    this.error = '';
    this.authData = { name: '', email: '', password: '' };
    document.body.style.overflow = 'hidden';
  }

  closeAuthModal() {
    this.showAuthModal = false;
    document.body.style.overflow = '';
  }

  toggleAuthMode() {
    this.authMode = this.authMode === 'login' ? 'register' : 'login';
    this.error = '';
  }

  onSubmit() {
    this.loading = true;
    this.error = '';
    
    if (this.authMode === 'login') {
      this.authService.login({ email: this.authData.email, password: this.authData.password })
        .subscribe({
          next: () => {
            this.loading = false;
            this.closeAuthModal();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error || 'Email ou mot de passe incorrect';
          }
        });
    } else {
      this.authService.register({ name: this.authData.name, email: this.authData.email, password: this.authData.password })
        .subscribe({
          next: () => {
            this.loading = false;
            this.closeAuthModal();
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error || 'Erreur lors de l\'inscription';
          }
        });
    }
  }
}
