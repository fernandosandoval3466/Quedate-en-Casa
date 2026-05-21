import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductService } from './admin-product.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EditProductPage implements OnInit {
  productId!: number;
  product: any = {};
  submitted = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminProductService);
  private productService = inject(ProductService);
  private toast = inject(ToastController);
  private alertController = inject(AlertController);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.loadProduct();
    }
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        const data = res.data || res;
        this.product = {
          nombre: data.Nombre,
          descripcion: data.Descripcion,
          precio: data.Precio,
          precio_original: data.Precio_Original,
          stock: data.Stock,
          imagen_url: data.Imagen_Url,
          categoria: data.Categoria || 'General'
        };
      }
    });
  }

  async updateProduct() {
    this.submitted = true;

    // Validación de campos vacíos
    if (!this.product.nombre?.trim() || !this.product.descripcion?.trim() || 
        this.product.precio == null || this.product.stock == null || 
        !this.product.imagen_url?.trim()) {
      const t = await this.toast.create({ 
        message: 'Por favor, complete todos los campos obligatorios', 
        duration: 3000, 
        color: 'warning' 
      });
      t.present();
      return;
    }

    this.adminService.updateProduct(this.productId, this.product).subscribe({
      next: async () => {
        const t = await this.toast.create({ message: 'Producto actualizado!', duration: 2000, color: 'success' });
        t.present();
        this.router.navigate(['/product-list']);
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: '¿Eliminar producto?',
      message: 'Esta acción es permanente y no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => { this.deleteProduct(); }
        }
      ]
    });
    await alert.present();
  }

  deleteProduct() {
    this.adminService.deleteProduct(this.productId).subscribe({
      next: async () => {
        const t = await this.toast.create({ message: 'Producto eliminado correctamente', duration: 2000, color: 'danger' });
        t.present();
        this.router.navigate(['/product-list']);
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  goBack() {
    this.router.navigate(['/product-list']);
  }
}