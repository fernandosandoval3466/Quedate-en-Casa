import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Registrar iconos para las alertas de feedback
    addIcons({ checkmarkCircle, alertCircle });
  }

  submit() {
    // Validación
    if (!this.email || !this.password) {
      this.error = 'Email y contraseña son requeridos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.success = true;
        this.loading = false;
        this.error = '';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      (error) => {
        this.loading = false;
        this.error = error.error?.error || 'Error al iniciar sesión.';
        console.error('Error en login:', error);
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
