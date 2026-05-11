import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { addIcons } from 'ionicons';
import { trashOutline, addOutline, removeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class CartPage implements OnInit {
  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {
    addIcons({ trashOutline, addOutline, removeOutline });
  }

  ngOnInit() {}

  updateQuantity(productId: number, currentQty: number, delta: number) {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      this.cartService.updateCart(productId, newQty).subscribe();
    } else {
      this.removeItem(productId);
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe();
  }

  checkout() {
    alert('¡Gracias por su compra! Función de pago en desarrollo.');
    this.cartService.clearCart().subscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}