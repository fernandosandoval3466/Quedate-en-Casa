import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle } from 'ionicons/icons';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class ForgotPasswordPage {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';
  success: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ checkmarkCircle, alertCircle });
  }

  async resetPassword() {
    this.error = '';
    this.success = false;

    if (!this.email || !this.newPassword || !this.confirmPassword) {
      this.error = 'Todos los campos son requeridos.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.authService.resetPassword(this.email, this.newPassword).subscribe({
      next: async (res) => {
        this.loading = false;
        this.success = true;
        const toast = await this.toastController.create({ message: res.message, duration: 2000, color: 'success' });
        await toast.present();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Error al restablecer la contraseña.';
      }
    });
  }
}