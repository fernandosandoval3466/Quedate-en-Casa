import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage),
    canActivate: [GuestGuard],
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.page').then(m => m.CartPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product/product.page').then(m => m.ProductPage),
  },
  {
    path: 'product-list',
    loadComponent: () => import('./product-list/product-list.page').then(m => m.ProductListPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: 'favorites',
    loadComponent: () => import('../theme/favorites.page').then(m => m.FavoritesPage),
  },
  {
    path: 'add-product',
    loadComponent: () => import('./services/add-product.page').then(m => m.AddProductPage),
  },
  {
    path: 'edit-product/:id',
    loadComponent: () => import('./services/edit-product.page').then(m => m.EditProductPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
