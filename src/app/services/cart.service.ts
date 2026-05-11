import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>(this.loadFromStorage());
  cart$ = this.cartSubject.asObservable();

  // Observable para el total de items (para el badge)
  cartCount$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.quantity, 0)));
  // Observable para el precio total
  cartTotal$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0)));

  constructor(private authService: AuthService) {
    // Escuchar cambios de autenticación para limpiar el carrito en memoria
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.cartSubject.next([]);
      } else {
        this.cartSubject.next(this.loadFromStorage());
      }
    });
  }

  private loadFromStorage(): any[] {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  }

  private saveToStorage(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  getCart(): Observable<any> {
    const items = this.cartSubject.value;
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    return of({ data: items, total: total });
  }

  addToCart(product: any, quantity: number): Observable<any> {
    let current = [...this.cartSubject.value];
    const index = current.findIndex(p => p.id === product.id);

    if (index > -1) {
      // Clonamos el objeto para asegurar que la referencia cambie y Angular detecte el cambio
      current[index] = { ...current[index], quantity: current[index].quantity + quantity };
    } else {
      current.push({ ...product, quantity });
    }

    this.cartSubject.next(current);
    this.saveToStorage(current);
    return of({ message: 'Producto añadido', data: current });
  }

  removeFromCart(productId: number): Observable<any> {
    const current = this.cartSubject.value.filter(p => p.id !== productId);
    this.cartSubject.next(current);
    this.saveToStorage(current);
    return of({ message: 'Producto eliminado', data: current });
  }

  updateCart(productId: number, quantity: number): Observable<any> {
    const current = [...this.cartSubject.value];
    const index = current.findIndex(p => p.id === productId);
    if (index > -1) {
      current[index].quantity = quantity;
      this.cartSubject.next(current);
      this.saveToStorage(current);
    }
    return of({ data: current });
  }

  clearCart(): Observable<any> {
    this.cartSubject.next([]);
    this.saveToStorage([]);
    return of({ message: 'Carrito vaciado' });
  }
}