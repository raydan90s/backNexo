const express = require('express');
const blogController = require('./server/blog');
const usuarioController = require('./server/usuario');
const videoController = require('./server/video');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jsonwebtoken

const app = express();


const router = express.Router();

// BLOGS
app.get('/blogs', blogController.obtenerTodosLosBlogs);
app.get('/blogs/:id', blogController.obtenerBlogPorId);
app.put('/blogs/:id', blogController.actualizarBlog);
app.delete('/blogs/:id', blogController.eliminarBlog);
app.post('/blogs', blogController.agregarBlog);
app.put('/orden', blogController.actualizarOrdenBlogs);

// Rutas de videos
app.get('/videos', videoController.obtenerTodosLosVideos);
app.get('/videos/:id', videoController.obtenerVideoPorId);  
app.post('/videos', videoController.agregarVideo);         
app.put('/videos/:id', videoController.actualizarVideo);    
app.delete('/videos/:id', videoController.eliminarVideo); 


// RUTA PARA CREAR UN NUEVO USUARIO
router.post('/usuarios', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const userId = await usuarioController.crearNuevoUsuario(correo, password);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: userId });
    } catch (error) {
        console.error('Error al crear usuario en api/usuarios:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el usuario' });
    }
});

// RUTA PARA CREAR UN NUEVO USUARIO
app.post('/usuarios', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const userId = await usuarioController.crearNuevoUsuario(correo, password);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: userId });
    } catch (error) {
        console.error('Error al crear usuario en /api/usuarios:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el usuario' });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const usuario = await usuarioController.verificarCredenciales(correo, password);

        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Si el login es exitoso, genera un token JWT
        const token = jwt.sign(
            { id: usuario.id, correo: usuario.correo },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Responde con el token JWT
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
module.exports = router; // Exporta el enrutador
