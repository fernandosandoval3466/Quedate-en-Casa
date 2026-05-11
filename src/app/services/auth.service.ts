import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private authState = new BehaviorSubject<boolean>(this.hasToken());
  
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.authState.asObservable();

  constructor() {
    const savedToken = this.getStoredToken();
    if (savedToken) this.tokenSubject.next(savedToken);
  }

  // Simulación de persistencia de usuarios locales
  private getLocalUsers(): any[] {
    const users = localStorage.getItem('mock_users');
    return users ? JSON.parse(users) : [];
  }

  register(name: string, email: string, password: string): Observable<any> {
    const users = this.getLocalUsers();
    if (users.find(u => u.email === email)) {
      return throwError(() => ({ error: { error: 'El correo ya está registrado' } }));
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));
    
    this.setToken('mock-jwt-token-' + newUser.id);
    return of({ message: 'Usuario registrado con éxito', user: newUser }).pipe(delay(800));
  }

  login(email: string, password: string): Observable<any> {
    const users = this.getLocalUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      this.setToken('mock-jwt-token-' + user.id);
      return of({ message: 'Login exitoso', user }).pipe(delay(800));
    } else {
      return throwError(() => ({ error: { error: 'Credenciales inválidas' } })).pipe(delay(800));
    }
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    const users = this.getLocalUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex > -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('mock_users', JSON.stringify(users));
      return of({ message: 'Contraseña actualizada correctamente' }).pipe(delay(800));
    } else {
      return throwError(() => ({ error: { error: 'Usuario no encontrado' } }));
    }
  }

  verify(): Observable<any> {
    return this.hasToken() 
      ? of({ valid: true }).pipe(delay(500)) 
      : throwError(() => ({ valid: false }));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('auth', 'true');
    this.tokenSubject.next(token);
    this.authState.next(true);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
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
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }
}
