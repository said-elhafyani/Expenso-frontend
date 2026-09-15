import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { AuthService } from '../../core/services/auth.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  currentTab: 'EXPENSE' | 'INCOME' = 'EXPENSE';
  isLoading = true;
  isAdmin = false;
  
  isModalOpen = false;
  isSaving = false;
  editingCategoryId: number | null = null;
  
  newCategory: Category = {
    name: '',
    type: 'EXPENSE',
    icon: 'fa-tags',
    color: '#6366f1',
    isGlobal: false
  };

  predefinedIcons = [
    'fa-tags', 'fa-utensils', 'fa-car', 'fa-house', 
    'fa-film', 'fa-bag-shopping', 'fa-money-bill-wave', 
    'fa-gift', 'fa-cart-shopping', 'fa-bolt', 'fa-plane'
  ];
  
  predefinedColors = [
    '#6366f1', '#f59e0b', '#3b82f6', '#10b981', 
    '#ec4899', '#8b5cf6', '#14b8a6', '#ef4444', 
    '#84cc16', '#0ea5e9'
  ];

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private mockService: MockDataService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.newCategory.isGlobal = this.isAdmin; // Default to global for admin
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories', err);
        this.isLoading = false;
      }
    });
  }

  get filteredCategories(): Category[] {
    return this.categories.filter(c => {
      const type = c.type || 'EXPENSE';
      return type === this.currentTab;
    });
  }

  openModal(category?: Category): void {
    if (category) {
      this.editingCategoryId = category.id!;
      this.newCategory = { ...category };
    } else {
      this.editingCategoryId = null;
      const randomColor = this.predefinedColors[Math.floor(Math.random() * this.predefinedColors.length)];
      this.newCategory = {
        name: '',
        type: this.currentTab,
        icon: 'fa-tags',
        color: randomColor,
        isGlobal: this.isAdmin
      };
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingCategoryId = null;
    const randomColor = this.predefinedColors[Math.floor(Math.random() * this.predefinedColors.length)];
    this.newCategory = {
      name: '',
      type: 'EXPENSE',
      icon: 'fa-tags',
      color: randomColor,
      isGlobal: this.isAdmin
    };
  }

  setType(type: 'EXPENSE' | 'INCOME'): void {
    this.newCategory.type = type;
  }

  selectIcon(icon: string): void {
    this.newCategory.icon = icon;
  }
  
  selectColor(color: string): void {
    this.newCategory.color = color;
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.newCategory.name) return;
    
    this.isSaving = true;

    if (this.editingCategoryId) {
      this.categoryService.updateCategory(this.editingCategoryId, this.newCategory).subscribe({
        next: (cat) => {
          const index = this.categories.findIndex(c => c.id === this.editingCategoryId);
          if (index !== -1) {
            this.categories[index] = cat;
          }
          this.mockService.addCategoryConfig(cat.name, {
            icon: cat.icon,
            color: cat.color,
            bg: `bg-[${cat.color}]/10`,
            text: `text-[${cat.color}]`,
            type: cat.type
          }, cat.id);
          this.isSaving = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur de modification', err);
          this.isSaving = false;
        }
      });
    } else {
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (cat) => {
          this.categories.push(cat);
          this.mockService.addCategoryConfig(cat.name, {
            icon: cat.icon,
            color: cat.color,
            bg: `bg-[${cat.color}]/10`,
            text: `text-[${cat.color}]`,
            type: cat.type
          }, cat.id);
          this.isSaving = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur de création', err);
          this.isSaving = false;
        }
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
      this.categoryService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.mockService.deleteCategoryConfig(category.name);
        },
        error: (err) => {
          console.error('Erreur de suppression', err);
          alert('Impossible de supprimer cette catégorie. Elle est peut-être utilisée par des transactions.');
        }
      });
    }
  }
}
