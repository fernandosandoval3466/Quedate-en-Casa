import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private authState = new BehaviorSubject<boolean>(this.hasToken());
  private _isAdmin = new BehaviorSubject<boolean>(this.checkAdminStatus());
  
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.authState.asObservable();
  public isAdmin$ = this._isAdmin.asObservable();

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {
    const savedToken = this.getStoredToken();
    if (savedToken) this.tokenSubject.next(savedToken);
  }

  register(name: string, email: string, password: string, role: string = 'cliente', adminCode?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, role, adminCode }).pipe(
      tap((res: any) => {
        this.setToken(res.token);
        this._isAdmin.next(res.user?.role?.toLowerCase() === 'administrador');
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        this.setToken(res.token);
        this._isAdmin.next(res.user?.role?.toLowerCase() === 'administrador');
      })
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, newPassword });
  }

  verify(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ valid: false, message: 'No token found' }));
    }
    // Llama al backend para verificar el token
    return this.http.get(`${this.apiUrl}/verify`, { headers: { 'Authorization': `Bearer ${token}` } }).pipe(
      map((res: any) => ({ valid: res.message === 'Token is valid', userId: res.userId, email: res.email })),
      catchError(error => {
        return throwError(() => ({ valid: false, message: error.error?.error || 'Token verification failed' }));
      })
    );
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('auth', 'true');
    this.tokenSubject.next(token);
    this.authState.next(true);
    this._isAdmin.next(this.checkAdminStatus());
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAdmin(): boolean {
    return this._isAdmin.value;
  }

  private checkAdminStatus(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.role?.toLowerCase() === 'administrador';
    } catch {
      return false;
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    localStorage.removeItem('cart');
    this.tokenSubject.next(null);
    this.authState.next(false);
    this._isAdmin.next(false);
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }
}
