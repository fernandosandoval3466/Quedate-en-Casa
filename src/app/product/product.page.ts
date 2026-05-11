import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
})
export class ProductPage implements OnInit {
  productId: number = 1;
  quantity: number = 1;
  isAuthenticated = false;

  product = {
    id: 1,
    name: 'Producto Artesanal Premium',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 127,
    image: 'assets/product1.svg',
    description: 'Pieza única hecha a mano con materiales de la más alta calidad. Cada detalle ha sido cuidadosamente elaborado por nuestros maestros artesanos.',
    features: [
      'Material 100% natural',
      'Hecho completamente a mano',
      'Diseño exclusivo',
      'Empaque ecológico',
      'Garantía de calidad',
      'Envío gratuito'
    ],
    details: {
      material: 'Cerámica y textiles naturales',
      dimensions: '25cm x 15cm x 10cm',
      weight: '500g',
      color: 'Multicolor',
      artisan: 'Maestro Artesano Juan García',
      createdDate: 'Abril 2026'
    },
    stock: 15
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.isAuthenticated = localStorage.getItem('auth') === 'true';
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = parseInt(id, 10);
        this.product.id = this.productId;
      }
    });
  }

  addToCart() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    alert(`${this.quantity} x ${this.product.name} agregado al carrito`);
    this.quantity = 1;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
}
