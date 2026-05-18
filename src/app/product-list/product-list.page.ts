import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { addIcons } from 'ionicons';
import { arrowBack, searchOutline, cartOutline, logOutOutline, addCircleOutline, createOutline, cart } from 'ionicons/icons';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, CurrencyPipe],
})
export class ProductListPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoggedIn = false;
  public isAdmin = false; // Nueva propiedad

  constructor() {
    addIcons({ arrowBack, searchOutline, cartOutline, logOutOutline, addCircleOutline, createOutline, cart });
  }

  products = [
    { id: 1, name: '1. Producto Artesanal Premium', price: 89.99, originalPrice: 129.99, rating: 4.8, image: 'assets/product1.svg' },
    { id: 2, name: '2. Cerámica Hecha a Mano', price: 65.00, originalPrice: 99.99, rating: 4.6, image: 'assets/product2.svg' },
    { id: 3, name: '3. Tejido Tradicional', price: 55.00, originalPrice: 85.00, rating: 4.9, image: 'assets/product3.svg' },
    { id: 4, name: '4. Pieza de Arte Única', price: 120.00, originalPrice: 180.00, rating: 5.0, image: 'assets/product4.svg' },
    { id: 5, name: '5. Diseño Contemporáneo', price: 75.00, originalPrice: 110.00, rating: 4.7, image: 'assets/product5.svg' },
    { id: 6, name: '6. Escultura Artesanal', price: 95.00, originalPrice: 150.00, rating: 4.8, image: 'assets/product6.svg' },
  ];

  filteredProducts: any[] = [];
  selectedCategory = 'all';
  sortBy = 'relevancia';

  ngOnInit() {
    // Nos suscribimos al estado de autenticación para que la página detecte el login
    // y actualice la interfaz (como el botón de perfil o carrito)
    this.authService.isAuthenticated$.subscribe(status => {
      this.isLoggedIn = status;
    });
    
    // Forzamos la comprobación inicial por si el observable ya emitió
    this.isAdmin = this.authService.isAdmin();

    this.authService.isAdmin$.subscribe(status => {
      this.isAdmin = status;
    });

    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products;
    this.sortProducts();
  }

  sortProducts() {
    switch (this.sortBy) {
      case 'precio-menor':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'precio-mayor':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevancia':
      default:
        break;
    }
  }

  onSortChange() {
    this.sortProducts();
  }

  onCategoryChange() {
    this.filterProducts();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    this.authService.logout();
  }

  goToAddProduct() {
    this.router.navigate(['/add-product']); // Deberás crear esta página después
  }

  goToEditProduct(productId: number, event: Event) {
    event.stopPropagation(); // Evita que se dispare el routerLink de la tarjeta
    this.router.navigate(['/edit-product', productId]);
  }
}
