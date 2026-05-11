# Arte y Diseño - Tienda de Artesanías Únicas

[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Arte y Diseño** es una solución PWA (Progressive Web App) y móvil dedicada a la comercialización y clases de manualidades. El proyecto implementa patrones de diseño modernos y una arquitectura reactiva para garantizar una navegación fluida.

## 🚀 Características Principales

*   **Autenticación Completa:** Sistema de Registro, Inicio de Sesión y Recuperación de Contraseña (implementado con lógica Mock para pruebas locales).
*   **Gestión de Carrito:** Carrito de compras reactivo con persistencia en `localStorage`, permitiendo que los productos se mantengan incluso al cerrar el navegador.
*   **Sistema de Favoritos:** Marcado de productos preferidos sincronizado en toda la aplicación.
*   **Modo Oscuro/Claro:** Soporte nativo para cambio de tema visual.
*   **Diseño Responsivo:** Optimizado para dispositivos móviles y escritorio.
*   **Buscador en Tiempo Real:** Filtro dinámico de productos por nombre.
*   **Backend Node.js:** Estructura de servidor preparada para escalabilidad con una arquitectura de controladores y rutas.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** Ionic Framework, Angular 18, SCSS.
*   **Backend:** Node.js, Express.
*   **Base de Datos:** Simulación mediante `localStorage` (Frontend) y arquitectura preparada para MySQL.
*   **Iconos:** Ionicons.

## 📦 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/arte-y-diseno.git
   ```

2. **Configurar el Frontend:**
   ```bash
   # Instalar dependencias
   npm install
   
   # Ejecutar en modo desarrollo
   ionic serve
   ```

3. **Configurar el Backend (Opcional para modo Mock):**
   ```bash
   # Navegar a la carpeta del servidor
   cd backend
   
   # Instalar dependencias del servidor
   npm install
   
   # Iniciar servidor
   npm start
   ```

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una separación clara de responsabilidades:
*   **Services:** Lógica de negocio y persistencia (Auth, Cart, Favorites).
*   **Guards:** Protección de rutas según el estado de autenticación.
*   **Observables (RxJS):** Gestión de estado reactivo para el carrito y la sesión.
*   **Controllers (Backend):** Lógica de API REST con Node.js y Express.

## 🎨 Diseño Visual
El proyecto utiliza una paleta de colores minimalista con tipografía *Inter*, enfocándose en resaltar las imágenes de los productos artesanales. La sección "Hero" utiliza el imagotipo de la marca para reforzar la identidad visual.

---
Desarrollado con ❤️ por tu nombre.
