const connection = require('./db.js'); // Importa la conexión desde db.js

// Obtener todos los videos
const obtenerTodosLosVideos = async (req, res) => {
    try {
        const [results] = await connection.query(
            'SELECT id, url, titulo FROM video' 
        );
        console.log("Consulta SQL exitosa para obtener videos, resultados:", results);
        res.json(results);
    } catch (err) {
        console.error("Error en la consulta SQL para obtener videos:", err);
        res.status(500).json({ error: err.message });
    }
};

// Obtener un video por ID
const obtenerVideoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await connection.query(
            'SELECT id, url, titulo FROM video WHERE id = ?', [id]
        );
        const video = rows[0];
        console.log("Consulta SQL exitosa para obtener video por ID, resultado:", video);
        if (video) {
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el video por ID:', error);
        res.status(500).json({ message: 'Error al obtener el video' });
    }
};

// Agregar un nuevo video
const agregarVideo = async (req, res) => {
    const { url, titulo } = req.body;
    console.log("Intento de agregar video con URL:", url, "y Título:", titulo); // Agregamos logging

    try {
        const [result] = await connection.query(
            'INSERT INTO video (url, titulo) VALUES (?, ?)',
            [url, titulo]
        );
        console.log("Video creado exitosamente con ID:", result.insertId); // Agregamos logging de éxito
        res.status(201).json({ id: result.insertId, message: 'Video creado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el video:', error); // Asegúrate de loguear el error completo
        res.status(500).json({ message: 'Error al crear el video', error: error.message }); // Incluye el mensaje de error en la respuesta (solo para desarrollo)
    }
};

// Actualizar un video
const actualizarVideo = async (req, res) => {
    const { id } = req.params;
    const { url, titulo } = req.body; // Asegúrate de recibir 'titulo' también
    try {
        const [result] = await connection.query(
            'UPDATE video SET url = ?, titulo = ? WHERE id = ?',
            [url, titulo, id] // Proporciona los tres valores: url, titulo, id
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Video actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Video no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error('Error al actualizar el video:', error);
        res.status(500).json({ message: 'Error al actualizar el video' });
    }
};

// Eliminar un video
const eliminarVideo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query(
            'DELETE FROM video WHERE id = ?', [id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Video eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Video no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el video:', error);
        res.status(500).json({ message: 'Error al eliminar el video' });
    }
};

module.exports = {
    obtenerTodosLosVideos,
    obtenerVideoPorId,
    agregarVideo,
    actualizarVideo,
    eliminarVideo
};