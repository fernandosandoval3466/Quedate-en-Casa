import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline, trashOutline } from 'ionicons/icons';
import { FavoritesService } from '../app/services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class FavoritesPage implements OnInit {
  favorites: any[] = [];

  constructor(private favoritesService: FavoritesService) {
    addIcons({ heart, heartOutline, trashOutline });
  }

  ngOnInit() {
    // Usar suscripción para que la lista se actualice en tiempo real
    this.favoritesService.favorites$.subscribe(favs => {
      this.favorites = favs;
    });
  }

  removeFromFavorites(productId: number) {
    const product = this.favorites.find(p => p.id === productId);
    if (product) {
      this.favoritesService.toggleFavorite(product);
    }
  }

  clearAll() {
    if (confirm('¿Estás seguro de que quieres vaciar tus favoritos?')) {
      [...this.favorites].forEach(p => this.favoritesService.toggleFavorite(p));
      this.favorites = [];
    }
  }
}