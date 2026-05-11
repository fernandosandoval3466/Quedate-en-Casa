import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    // Validación
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password).subscribe(
      (response) => {
        this.success = true;
        this.loading = false;
        console.log('Registro exitoso:', response.user);
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      (error) => {
        this.loading = false;
        this.error = error.error?.error || 'Error en el registro. Intenta de nuevo.';
        console.error('Error en registro:', error);
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
