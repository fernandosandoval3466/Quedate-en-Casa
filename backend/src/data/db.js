// In-memory database
const db = {
  users: [
    {
      id: 1,
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    }
  ],
  products: [
    { id: 1, name: 'Producto Artesanal Premium', price: 89.99, originalPrice: 129.99, rating: 4.8, image: 'assets/product1.svg', description: 'Pieza única hecha a mano con materiales de la más alta calidad.', features: ['Material premium', 'Hecho a mano', 'Garantía de calidad'], details: { material: 'Cerámica', dimensions: '15x10cm', weight: '500g', color: 'Natural', artisan: 'Maestro García', createdDate: '2024-01-15' } },
    { id: 2, name: 'Cerámica Hecha a Mano', price: 65.00, originalPrice: 99.99, rating: 4.6, image: 'assets/product2.svg', description: 'Cerámica tradicional elaborada por maestros artesanos.', features: ['Técnica tradicional', 'Resistente', 'Pieza única'], details: { material: 'Cerámica artesanal', dimensions: '12x8cm', weight: '400g', color: 'Rojo', artisan: 'María López', createdDate: '2024-01-10' } },
    { id: 3, name: 'Tejido Tradicional', price: 55.00, originalPrice: 85.00, rating: 4.9, image: 'assets/product3.svg', description: 'Tejidos con técnicas ancestrales de nuestros artesanos.', features: ['Técnica ancestral', 'Suave al tacto', 'Ecológico'], details: { material: 'Algodón natural', dimensions: '20x15cm', weight: '200g', color: 'Azul', artisan: 'Rosa Morales', createdDate: '2024-01-05' } },
    { id: 4, name: 'Maceta Decorativa', price: 45.00, originalPrice: 65.00, rating: 4.7, image: 'assets/product4.svg', description: 'Maceta decorativa hecha a mano.', features: ['Decorativa', 'Resistente'], details: { material: 'Cerámica', dimensions: '10x10cm', weight: '300g', color: 'Blanco', artisan: 'Carlos Rodríguez', createdDate: '2024-01-20' } },
    { id: 5, name: 'Collar Artesanal', price: 35.00, originalPrice: 55.00, rating: 4.5, image: 'assets/product5.svg', description: 'Collar hecho con materiales naturales.', features: ['Material natural', 'Ajustable'], details: { material: 'Madera y cuentas', dimensions: 'Ajustable', weight: '50g', color: 'Multicolor', artisan: 'Ana Martínez', createdDate: '2024-01-18' } },
    { id: 6, name: 'Almohada Tejida', price: 75.00, originalPrice: 110.00, rating: 4.8, image: 'assets/product6.svg', description: 'Almohada tejida con lana orgánica.', features: ['Lana orgánica', 'Suave', 'Relleno incluido'], details: { material: 'Lana orgánica', dimensions: '40x40cm', weight: '400g', color: 'Gris', artisan: 'Josefina Ruiz', createdDate: '2024-01-12' } },
    { id: 7, name: 'Bandeja de Madera', price: 50.00, originalPrice: 75.00, rating: 4.6, image: 'assets/product7.svg', description: 'Bandeja decorativa de madera maciza.', features: ['Madera maciza', 'Duradero'], details: { material: 'Madera de roble', dimensions: '30x20cm', weight: '600g', color: 'Marrón', artisan: 'Pedro Sánchez', createdDate: '2024-01-14' } },
    { id: 8, name: 'Espejo Enmarcado', price: 120.00, originalPrice: 180.00, rating: 4.9, image: 'assets/product8.svg', description: 'Espejo decorativo con marco artesanal.', features: ['Marco único', 'Espejo de calidad'], details: { material: 'Madera y vidrio', dimensions: '50x40cm', weight: '1200g', color: 'Natural', artisan: 'Maestro Hernández', createdDate: '2024-01-08' } },
    { id: 9, name: 'Vaso Artesanal', price: 25.00, originalPrice: 40.00, rating: 4.4, image: 'assets/product9.svg', description: 'Vaso de cerámica hecho a mano.', features: ['Resistente', 'Reutilizable'], details: { material: 'Cerámica', dimensions: '10x8cm', weight: '200g', color: 'Verde', artisan: 'Luis García', createdDate: '2024-01-16' } }
  ],
  carts: {} // { userId: [{ productId, quantity }] }
};

const getNextUserId = () => {
  return Math.max(...db.users.map(u => u.id), 0) + 1;
};

module.exports = { db, getNextUserId };
