require('dotenv').config();
const mysql = require('mysql2');

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

// Usar el pool para hacer consultas de manera asincrónica
const promisePool = pool.promise();

// Función para obtener todos los blogs
async function obtenerBlogs() {
  try {
    const [rows] = await promisePool.query('SELECT * FROM blogs');
    return rows;
  } catch (error) {
    console.error('Error al obtener blogs:', error);
    throw error; // Lanza el error para que lo maneje el controlador
  }
}

// Exportar el pool y la función para obtener blogs
module.exports = { promisePool, obtenerBlogs };
