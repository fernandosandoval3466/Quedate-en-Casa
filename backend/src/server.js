const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Servidor escuchando en: http://127.0.0.1:${PORT}`);
  console.log(`📡 Intenta abrir en tu navegador: http://127.0.0.1:${PORT}/api/health`);
});
