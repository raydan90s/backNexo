require('dotenv').config();
const mysql = require('mysql2/promise'); // Asegúrate de importar la versión con promesas

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, // Mantener vivas las conexiones
  idleTimeout: 60000,    // Tiempo de espera antes de cerrar una conexión inactiva
  maxIdle: 0,           // No limitar el número de conexiones inactivas
  keepAliveInitialDelay: 0 // Retraso antes de enviar paquetes keep-alive
});

// Exportar el pool para su uso en otras partes de la aplicación
module.exports = pool;
