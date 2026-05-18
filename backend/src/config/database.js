const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433, // Puerto estándar que configuramos en el paso anterior
  options: {
    encrypt: false, // Desactivado para facilitar la conexión en desarrollo local
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    // instanceName: 'SQLEXPRESS' // Al usar el puerto 1433 fijo, no es necesario y evita el timeout
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    // Verificación de la variable JWT
    if (process.env.JWT_SECRET) {
      console.log('🔑 JWT_SECRET: Cargado correctamente.');
    } else {
      console.error('❌ JWT_SECRET: No se encontró en el archivo .env');
    }

    console.log(`✅ Conectado a SQL Server (${dbConfig.database}) como usuario: ${dbConfig.user}`);
    return pool;
  })
  .catch(err => {
    console.error('❌ Error de conexión a la base de datos: ', err);
    process.exit(1);
  });

module.exports = {
  sql, poolPromise
};