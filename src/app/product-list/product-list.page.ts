import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
})
export class ProductListPage implements OnInit {
  products = [
    { id: 1, name: 'Producto Artesanal Premium', price: 89.99, originalPrice: 129.99, rating: 4.8, image: 'assets/product1.svg' },
    { id: 2, name: 'Cerámica Hecha a Mano', price: 65.00, originalPrice: 99.99, rating: 4.6, image: 'assets/product2.svg' },
    { id: 3, name: 'Tejido Tradicional', price: 55.00, originalPrice: 85.00, rating: 4.9, image: 'assets/product3.svg' },
    { id: 4, name: 'Pieza de Arte Única', price: 120.00, originalPrice: 180.00, rating: 5.0, image: 'assets/product4.svg' },
    { id: 5, name: 'Diseño Contemporáneo', price: 75.00, originalPrice: 110.00, rating: 4.7, image: 'assets/product5.svg' },
    { id: 6, name: 'Escultura Artesanal', price: 95.00, originalPrice: 150.00, rating: 4.8, image: 'assets/product6.svg' },
    { id: 7, name: 'Decoración Exclusiva', price: 45.00, originalPrice: 70.00, rating: 4.5, image: 'assets/product1.svg' },
    { id: 8, name: 'Joya Artesana', price: 135.00, originalPrice: 200.00, rating: 5.0, image: 'assets/product2.svg' },
    { id: 9, name: 'Objeto de Colección', price: 110.00, originalPrice: 160.00, rating: 4.9, image: 'assets/product3.svg' },
  ];

  filteredProducts: any[] = [];
  selectedCategory = 'all';
  sortBy = 'relevancia';

  constructor(private router: Router) {}

  ngOnInit() {
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
}
