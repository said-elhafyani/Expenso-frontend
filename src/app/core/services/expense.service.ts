import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseRequest, ExpenseResponse } from '../models/expense.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) { }

  getAllExpenses(): Observable<ExpenseResponse[]> {
    return this.http.get<ExpenseResponse[]>(this.apiUrl);
  }

  createExpense(expense: ExpenseRequest): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(this.apiUrl, expense);
  }
}
