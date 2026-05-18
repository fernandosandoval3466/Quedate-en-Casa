import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AdminProductService } from './admin-product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddProductPage {
  product = {
    nombre: '',
    descripcion: '',
    precio: 0,
    precio_original: null,
    imagen_url: '',
    stock: 0
  };

  private adminService = inject(AdminProductService);
  private router = inject(Router);
  private toast = inject(ToastController);

  async saveProduct() {
    this.adminService.addProduct(this.product).subscribe({
      next: async () => {
        const t = await this.toast.create({ message: 'Producto creado!', duration: 2000, color: 'success' });
        t.present();
        this.router.navigate(['/product-list']);
      },
      error: (err) => console.error(err)
    });
  }

  goBack() {
    this.router.navigate(['/product-list']);
  }
}