import { Category } from './category.model';

export interface ExpenseResponse {
  id: number;
  amount: number;
  expenseDate: string;
  reason: string;
  note?: string;
  category: Category;
}

export interface ExpenseRequest {
  amount: number;
  expenseDate: string;
  reason: string;
  note?: string;
  categoryId: number;
}
