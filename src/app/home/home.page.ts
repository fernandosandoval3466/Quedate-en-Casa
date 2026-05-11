import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  close, 
  heart, 
  heartOutline, 
  searchOutline, 
  arrowForward, 
  cart, 
  sunnyOutline, 
  moonOutline, 
  cartOutline 
} from 'ionicons/icons';
import { ThemeService } from '../services/theme.service';
import { FavoritesService } from '../services/favorites.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
})
export class HomePage implements OnInit {
  selectedProduct: any = null;
  showPreview = false;
  darkMode = false;
  searchTerm = '';
  cartCount = 0;

  products = [
    { id: 1, name: 'Producto Artesanal Premium', price: 89.99, originalPrice: 129.99, rating: 4.8, image: 'assets/product1.svg', description: 'Pieza única hecha a mano con materiales de la más alta calidad.', liked: false },
    { id: 2, name: 'Cerámica Hecha a Mano', price: 65.00, originalPrice: 99.99, rating: 4.6, image: 'assets/product2.svg', description: 'Cerámica tradicional elaborada por maestros artesanos.', liked: false },
    { id: 3, name: 'Tejido Tradicional', price: 55.00, originalPrice: 85.00, rating: 4.9, image: 'assets/product3.svg', description: 'Tejidos con técnicas ancestrales de nuestros artesanos.', liked: false },
  ];
  filteredProducts = [...this.products];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private themeService: ThemeService,
    private toastController: ToastController,
    private favoritesService: FavoritesService,
    public authService: AuthService,
    private cartService: CartService
  ) {
    addIcons({ 
      close, 
      heart, 
      heartOutline, 
      searchOutline, 
      arrowForward, 
      cart, 
      sunnyOutline, 
      moonOutline, 
      cartOutline 
    });
  }

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });

    // Sincronizar el estado de "liked" con el servicio de favoritos
    this.favoritesService.favorites$.subscribe(favs => {
      this.products.forEach(p => {
        p.liked = favs.some(f => f.id === p.id);
      });
      this.filterProducts();
    });

    // Suscribirse al conteo del carrito
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleLike(product: any) {
    this.favoritesService.toggleFavorite(product);
  }

  addToCart(product: any) {
    if (!this.authService.isAuthenticated()) {
      this.presentToast('Debes iniciar sesión para comprar');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        this.presentToast(`${product.name} añadido al carrito`);
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
        this.presentToast('Error al conectar con el servidor');
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  openPreview(productId: number) {
    this.selectedProduct = this.products.find(p => p.id === productId);
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
    this.selectedProduct = null;
  }

  goToProduct(productId: number) {
    this.closePreview();
    this.router.navigate(['/product', productId]);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
