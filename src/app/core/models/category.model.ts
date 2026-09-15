export interface Category {
  id?: number;
  name: string;
  description?: string;
  type: 'EXPENSE' | 'INCOME';
  isGlobal?: boolean;
  icon?: string;
  color?: string;
}
