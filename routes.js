const express = require('express');
const blogController = require('./server/blog');
const usuarioController = require('./server/usuario');
const videoController = require('./server/video');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jsonwebtoken

const app = express();


const router = express.Router();

// BLOGS
app.get('/api/blogs', blogController.obtenerTodosLosBlogs);
app.get('/api/blogs/:id', blogController.obtenerBlogPorId);
app.put('/api/blogs/:id', blogController.actualizarBlog);
app.delete('/api/blogs/:id', blogController.eliminarBlog);
app.post('/api/blogs', blogController.agregarBlog);
app.put('/api/orden', blogController.actualizarOrdenBlogs);

// Rutas de videos
app.get('/api/videos', videoController.obtenerTodosLosVideos);
app.get('/api/videos/:id', videoController.obtenerVideoPorId);  
app.post('/api/videos', videoController.agregarVideo);         
app.put('/api/videos/:id', videoController.actualizarVideo);    
app.delete('/api/videos/:id', videoController.eliminarVideo); 


// RUTA PARA CREAR UN NUEVO USUARIO
router.post('/api/usuarios', async (req, res) => {
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

// RUTA PARA CREAR UN NUEVO USUARIO
app.post('/api/usuarios', async (req, res) => {
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
app.post('/api/login', async (req, res) => {
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
