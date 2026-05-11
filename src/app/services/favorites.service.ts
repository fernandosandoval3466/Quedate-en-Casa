import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<any[]>(this.loadFromStorage());
  favorites$ = this.favoritesSubject.asObservable();

  private loadFromStorage(): any[] {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  }

  toggleFavorite(product: any) {
    let current = [...this.favoritesSubject.value];
    const index = current.findIndex(p => p.id === product.id);
    
    if (index > -1) {
      current = current.filter(p => p.id !== product.id); // Quitar si ya existe
      product.liked = false;
    } else {
      current.push(product); // Agregar si no existe
      product.liked = true;
    }

    this.favoritesSubject.next(current);
    this.saveToStorage(current);
  }

  private saveToStorage(favorites: any[]) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getFavorites() {
    return this.favoritesSubject.value;
  }
}