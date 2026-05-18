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
import { ProductService } from '../services/product.service';
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

  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
    private themeService: ThemeService,
    private toastController: ToastController,
    private favoritesService: FavoritesService,
    public authService: AuthService,
    private cartService: CartService,
    private productService: ProductService
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
    this.loadInitialData();
  }

  ionViewWillEnter() {
    // Asegurar que el estado de autenticación y datos se refresquen al volver a la página
    this.loadInitialData();
  }

  private loadInitialData() {
    this.darkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe(isDark => {
      this.darkMode = isDark;
    });

    // Cargar productos y luego sincronizar favoritos
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        const rawData = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : []);
        this.products = rawData.map((p: any) => ({
          id: p.Id ?? p.id,
          name: p.Nombre ?? p.name,
          price: p.Precio ?? p.price,
          image: p.Imagen_Url ?? p.image ?? 'assets/icon/Logo.png',
          description: p.Descripcion ?? p.description,
          rating: p.Rating ?? p.rating,
          originalPrice: p.Precio_Original ?? p.originalPrice,
          liked: false
        }));
        
        // Sincronizar con favoritos inmediatamente después de cargar
        const currentFavs = this.favoritesService.getCurrentFavorites();
        this.products.forEach((p: any) => {
          p.liked = currentFavs.some((f: any) => f.id === p.id);
        });

        this.filterProducts();
      },
      error: (err) => console.error('Error cargando productos:', err)
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
    if (!this.products) return;
    this.filteredProducts = this.products.filter(p => 
      p.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
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
