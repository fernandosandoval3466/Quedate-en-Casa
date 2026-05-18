import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ReviewService } from '../services/review.service';
import { addIcons } from 'ionicons';
import { arrowBack, cart, remove, add, heart, logOutOutline, cartOutline, searchOutline, createOutline } from 'ionicons/icons';

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
  public isLoggedIn = false;
  public isAdmin = false;
  
  public productReviews: any[] = [];
  public newRating = 5;
  public newComment = '';

  product: any = {
    id: null, name: '', price: 0, originalPrice: 0, rating: 0, reviews: 0,
    image: 'assets/icon/Logo.png', description: '', stock: 0,
    features: [],
    details: {
      material: '', dimensions: '', weight: '', color: '', artisan: '', createdDate: ''
    }
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public authService: AuthService,
    private cartService: CartService,
    private toastController: ToastController,
    private reviewService: ReviewService
  ) {
    // Registramos los iconos necesarios para que aparezcan en los botones
    addIcons({ arrowBack, cart, remove, add, heart, logOutOutline, cartOutline, searchOutline, createOutline });
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((status: boolean) => this.isLoggedIn = status);
    this.authService.isAdmin$.subscribe((status: boolean) => this.isAdmin = status);
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = parseInt(id, 10);
        this.loadProduct();
        this.loadReviews();
      }
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        const p = res?.data || res;
        if (p) {
          this.product = {
            id: p.Id ?? p.id,
            name: p.Nombre ?? p.name,
            price: p.Precio ?? p.price,
            image: p.Imagen_Url ?? p.image ?? 'assets/icon/Logo.png', // Default image if none
            description: p.Descripcion ?? p.description,
            rating: p.Rating ?? p.rating,
            stock: p.Stock ?? p.stock ?? 10, // Default stock if none
            reviews: p.Reviews ?? p.reviews ?? 0,
            originalPrice: p.Precio_Original ?? p.originalPrice,
            // Asumiendo que details y features no vienen del backend todavía, o están en un formato diferente
            // Si vienen, los mapearías aquí:
            // details: p.Details ? JSON.parse(p.Details) : { material: '', dimensions: '', weight: '', color: '', artisan: '', createdDate: '' },
            // features: p.Features ? JSON.parse(p.Features) : []
            details: { material: '', dimensions: '', weight: '', color: '', artisan: '', createdDate: '' }, // Detalles por defecto vacíos
            features: [] // Características por defecto vacías
          };
        }
      },
      error: (err) => console.error('Error cargando producto:', err)
    });
  }

  loadReviews() {
    this.reviewService.getReviewsByProduct(this.productId).subscribe({
      next: (res) => this.productReviews = res.data,
      error: (err) => console.error('Error cargando reseñas:', err)
    });
  }

  addToCart() {
    if (!this.isLoggedIn) {
      this.presentToast('Debes iniciar sesión para agregar al carrito');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product || !this.product.id) {
      this.presentToast('Error: Información del producto no disponible');
      return;
    }

    if (this.product.stock <= 0) {
      this.presentToast('Lo sentimos, este producto no tiene stock disponible');
      return;
    }

    // Llamamos al servicio real para persistir en la base de datos SQL
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: () => {
        this.presentToast(`${this.quantity} x ${this.product.name} agregado al carrito`);
        this.quantity = 1; // Resetear cantidad tras la compra
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
        this.presentToast('Error al conectar con el servidor');
      }
    });
  }

  submitReview() {
    if (!this.isLoggedIn) {
      this.presentToast('Inicia sesión para dejar una reseña');
      return;
    }
    if (!this.newComment.trim()) {
      this.presentToast('El comentario no puede estar vacío');
      return;
    }

    const reviewData = {
      productId: this.productId,
      rating: this.newRating,
      comment: this.newComment
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: () => {
        this.presentToast('¡Gracias por tu reseña!');
        this.newComment = '';
        this.newRating = 5;
        this.loadReviews();
      },
      error: () => this.presentToast('Error al enviar la reseña')
    });
  }

  editProduct() {
    this.router.navigate(['/edit-product', this.productId]);
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

  /**
   * Cierra la sesión del usuario
   */
  logout() {
    this.authService.logout();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  decreaseQuantity() {
    if (this.product && this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
}
