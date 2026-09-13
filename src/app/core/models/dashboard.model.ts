export interface Period {
  type: string;
  year: number;
  month: number;
}

export interface CategoryStat {
  category: string;
  amount: number;
}

export interface DashboardData {
  period: Period;
  total: number;
  numberOfExpenses: number;
  averagePerDay: number;
  biggestExpense: number;
  budget: number;
  remainingBudget: number;
  categories: CategoryStat[];
}
