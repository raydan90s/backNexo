const express = require('express');
const blogController = require('./server/blog');
const usuarioController = require('./server/usuario');
const videoController = require('./server/video');
const jwt = require('jsonwebtoken'); // Asegúrate de importar jsonwebtoken
const router = express.Router();

// Rutas de BLOGS
router.get('/blogs', blogController.obtenerTodosLosBlogs);
router.get('/blogs/:id', blogController.obtenerBlogPorId);
router.put('/blogs/:id', blogController.actualizarBlog);
router.delete('/blogs/:id', blogController.eliminarBlog);
router.post('/blogs', blogController.agregarBlog);
router.put('/orden', blogController.actualizarOrdenBlogs);

// Rutas de VIDEOS
router.get('/videos', videoController.obtenerTodosLosVideos);
router.get('/videos/:id', videoController.obtenerVideoPorId);  
router.post('/videos', videoController.agregarVideo);         
router.put('/videos/:id', videoController.actualizarVideo);    
router.delete('/videos/:id', videoController.eliminarVideo); 

// RUTA PARA CREAR UN NUEVO USUARIO
router.post('/usuarios', async (req, res) => {
    const { correo, password } = req.body;
    try {
        const userId = await usuarioController.crearNuevoUsuario(correo, password);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: userId });
    } catch (error) {
        console.error('Error al crear usuario en /usuarios:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear el usuario' });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
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

