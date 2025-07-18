const express = require('express');
const cors = require('cors');
const router = require('./routes');  // Importamos el router con las rutas definidas en routes.js
const dotenv = require('dotenv');

const app = express();
dotenv.config();  // Cargar las variables de entorno desde .env

// Configuración de CORS
const allowedOrigins = [
  'http://localhost:5174',  // Frontend local
  'https://www.novafenix-ec.com',  // Otro frontend permitido
];

// Configurar CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);  // Si la solicitud es válida, la permite
    } else {
      callback(new Error(`CORS: Origin ${origin} no permitido`));  // Si la solicitud no es válida, responde con error
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,  // Permite enviar cookies
};

// Aplicar CORS con configuración personalizada
app.use(cors(corsOptions));

// Usamos middleware para manejar el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Middleware para loguear todas las solicitudes
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();  // Llama al siguiente middleware o ruta
});

// Usamos el router importado desde routes.js
app.use('/api', router);  // Esto agrega el prefijo /api a todas las rutas definidas en routes.js

// Error handler: si hay un error no manejado en ninguna de las rutas, lo captura
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
