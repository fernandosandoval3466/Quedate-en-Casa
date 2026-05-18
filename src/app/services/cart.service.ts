import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://127.0.0.1:3000/api/cart';
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  // Observable para el total de items (para el badge)
  cartCount$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + item.quantity, 0)));
  // Observable para el precio total
  cartTotal$ = this.cart$.pipe(map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0)));

  constructor(private authService: AuthService, private http: HttpClient) {
    // Escuchar cambios de autenticación para limpiar el carrito en memoria
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (!isAuth) {
        this.cartSubject.next([]);
      } else {
        this.loadCartFromServer();
      }
    });
  }

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private loadCartFromServer() {
    this.http.get<any>(this.apiUrl, this.getHeaders()).subscribe(res => { // res.data ahora contiene los items
      this.cartSubject.next(res.data);
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl, this.getHeaders());
  }

  addToCart(product: any, quantity: number): Observable<any> {
    // Aseguramos que tome el ID sin importar si viene como 'id' o 'Id' desde el SQL
    const productId = product.id || product.Id;
    return this.http.post<any>(this.apiUrl, { productId, quantity }, this.getHeaders())
      .pipe(tap(() => this.loadCartFromServer()));
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`, this.getHeaders())
      .pipe(tap(() => this.loadCartFromServer()));
  }

  /**
   * Actualiza la cantidad de un producto específico en el carrito.
   * @param productId ID del producto a actualizar.
   * @param quantity Nueva cantidad del producto.
   */
  updateCart(productId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, { quantity }, this.getHeaders())
      .pipe(tap(() => this.loadCartFromServer()));
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear`, this.getHeaders())
      .pipe(tap(() => this.cartSubject.next([]))); // Vaciar el carrito localmente después de la petición
  }
}