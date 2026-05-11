# Servicios del Frontend - Arte y Diseño

Documentación de los servicios HTTP para comunicar con el backend.

## Servicios disponibles

### 1. AuthService

Maneja la autenticación del usuario (login, register, verificación de token).

**Archivo:** `src/app/services/auth.service.ts`

**Métodos:**

```typescript
// Registrar nuevo usuario
authService.register(name, email, password).subscribe(
  (response) => {
    console.log('Usuario registrado:', response);
  },
  (error) => console.error(error)
);

// Iniciar sesión
authService.login(email, password).subscribe(
  (response) => {
    console.log('Login exitoso:', response);
  },
  (error) => console.error(error)
);

// Verificar si el token es válido
authService.verify().subscribe(
  (response) => console.log('Token válido:', response)
);

// Obtener token actual
const token = authService.getToken();

// Verificar si está autenticado
if (authService.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Cerrar sesión
authService.logout();
```

---

### 2. ProductService

Obtiene información de los productos.

**Archivo:** `src/app/services/product.service.ts`

**Métodos:**

```typescript
// Obtener todos los productos
productService.getAllProducts().subscribe(
  (response) => {
    console.log('Total de productos:', response.total);
    console.log('Productos:', response.data);
  }
);

// Obtener un producto específico por ID
productService.getProductById(1).subscribe(
  (response) => {
    console.log('Producto:', response.data);
  }
);

// Buscar productos
productService.searchProducts('cerámica').subscribe(
  (response) => {
    console.log('Resultados:', response.data);
  }
);
```

---

### 3. CartService

Maneja el carrito de compras del usuario (requiere autenticación).

**Archivo:** `src/app/services/cart.service.ts`

**Métodos:**

```typescript
// Obtener carrito actual
cartService.getCart().subscribe(
  (response) => {
    console.log('Items:', response.data);
    console.log('Total:', response.total);
  }
);

// Agregar producto al carrito
cartService.addToCart(productId, quantity).subscribe(
  (response) => console.log('Producto agregado:', response)
);

// Remover producto del carrito
cartService.removeFromCart(productId).subscribe(
  (response) => console.log('Producto removido:', response)
);

// Actualizar cantidad de un producto
cartService.updateCart(productId, newQuantity).subscribe(
  (response) => console.log('Carrito actualizado:', response)
);

// Vaciar el carrito
cartService.clearCart().subscribe(
  (response) => console.log('Carrito vaciado:', response)
);
```

---

## Cómo usar en componentes

### Ejemplo en login.page.ts

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login exitoso:', response.user);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.error = error.error.error || 'Error en el login';
        this.loading = false;
      }
    );
  }
}
```

### Ejemplo en cart.page.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(
      (response) => {
        this.cartItems = response.data;
        this.total = response.total;
      }
    );
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe(
      () => this.loadCart()
    );
  }
}
```

---

## Configuración

- **API URL:** `http://127.0.0.1:3000/api`
- **Backend debe estar corriendo:** `npm start` en la carpeta `/backend`
- **CORS:** Habilitado para `4200` (Angular) y `8100` (Ionic)

## Notas

- Todos los servicios del carrito requieren autenticación (JWT token)
- El token se almacena automáticamente en localStorage
- El token se envía en el header `Authorization: Bearer <token>`
