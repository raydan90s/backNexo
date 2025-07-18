const express = require('express');
const cors = require('cors');
const router = require('./routes');  // Importamos el router con las rutas definidas

const app = express();

// Usamos CORS y middleware para JSON
app.use(cors());
app.use(express.json());  

// Middleware para loguear todas las solicitudes
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // Llama al siguiente middleware o ruta
});

// Usamos el router importado desde routes.js
app.use('/api', router);  // Aquí estamos diciendo que todas las rutas definidas en 'router' estarán bajo el prefijo '/api'

// Iniciar el servidor
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
