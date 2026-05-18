import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { 
  IonApp, 
  IonRouterOutlet, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonToggle,
  IonMenuToggle,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, sunny, cart, person, settings, logOut, heart } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp, 
    IonRouterOutlet, 
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonToggle,
    IonMenuToggle,
    IonButtons,
    IonMenuButton,
    RouterLink,
  ],
})
export class AppComponent implements OnInit {
  public isDark = false;
  public isAuthenticated = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private titleService: Title) {
    // Registramos los iconos que vamos a usar
    addIcons({ moon, sunny, cart, person, settings, logOut, heart });
    // Cambiamos el título de la pestaña del navegador
    this.titleService.setTitle('Arte y Diseño');
  }

  ngOnInit() {
    // Nos suscribimos al estado de autenticación para que la UI reaccione al login/logout
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    /* Comentado temporalmente el modo oscuro
    // 1. Detectar la preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = prefersDark.matches;

    // 2. Inicializar el tema basado en la preferencia actual
    this.initializeDarkPalette(this.isDark);

    // 3. Escuchar cambios en la configuración del sistema en tiempo real
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
    */
  }

  /**
   * Agrega o quita la clase 'dark' al body para cambiar el tema
   */
  initializeDarkPalette(isDark: boolean) {
    // Comentado temporalmente
    // this.isDark = isDark;
    // document.body.classList.toggle('dark', isDark);
  }

  /**
   * Método para cerrar sesión desde el menú lateral
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
