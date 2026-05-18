import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<any[]>(this.loadFavoritesFromStorage());
  favorites$ = this.favoritesSubject.asObservable();

  constructor() { }

  private loadFavoritesFromStorage(): any[] {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  }

  private saveFavoritesToStorage(favorites: any[]) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getCurrentFavorites(): any[] {
    return this.favoritesSubject.value;
  }

  toggleFavorite(product: any) {
    const currentFavs = this.favoritesSubject.value;
    const index = currentFavs.findIndex(fav => fav.id === product.id);

    if (index > -1) {
      // Eliminar de favoritos
      currentFavs.splice(index, 1);
      product.liked = false;
    } else {
      // Añadir a favoritos
      currentFavs.push({ ...product, liked: true });
      product.liked = true;
    }
    this.favoritesSubject.next(currentFavs);
    this.saveFavoritesToStorage(currentFavs);
  }
}