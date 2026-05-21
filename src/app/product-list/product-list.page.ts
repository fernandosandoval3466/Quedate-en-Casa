import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
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
  private productService = inject(ProductService);

  public isLoggedIn = false;
  public isAdmin = false; // Nueva propiedad

  constructor() {
    addIcons({ arrowBack, searchOutline, cartOutline, logOutOutline, addCircleOutline, createOutline, cart });
  }

  products: any[] = [];
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

    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : (res.data || []);
        // Mapeamos los campos de la BD a los campos de tu interfaz
        this.products = data.map((p: any) => ({
          id: p.Id,
          name: p.Nombre,
          price: p.Precio,
          originalPrice: p.Precio_Original || p.Precio,
          rating: p.Rating || 5.0,
          image: p.Imagen_Url || 'assets/icon/Logo.png',
          category: p.Categoria || 'General'
        }));
        this.filterProducts();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  filterProducts() {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => 
        p.category?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
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
