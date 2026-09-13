import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData } from '../models/dashboard.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(year: number, month: number): Observable<DashboardData> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
      
    return this.http.get<DashboardData>(this.apiUrl, { params });
  }
}
