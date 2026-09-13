import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<any>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      tap((user: any) => {
        window.sessionStorage.removeItem(USER_KEY);
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'register', {
      name: user.name,
      email: user.email,
      password: user.password
    });
  }

  logout(): void {
    window.sessionStorage.removeItem(USER_KEY);
    this.currentUserSubject.next(null);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user;
  }

  public isAdmin(): boolean {
    const user = this.getUser();
    return user && user.role === 'ADMIN';
  }
  
  public getToken(): string | null {
    const user = this.getUser();
    return user ? user.token : null;
  }
}
