const connection = require('./db.js'); // Importa la conexión desde db.js

// Obtener todos los blogs
const obtenerTodosLosBlogs = async (req, res) => {
    try {
        const [results] = await connection.query(
            'SELECT id, titulo, resumen, urlImagen, orden FROM blog ORDER BY orden ASC'
        );
        console.log("Consulta SQL exitosa para obtener blogs, resultados:", results);
        res.json(results);
    } catch (err) {
        console.error("Error en la consulta SQL para obtener blogs:", err);
        res.status(500).json({ error: err.message });
    }
};

// Obtener un blog por ID
// Obtener un blog por ID
const obtenerBlogPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await connection.query(
            'SELECT *, DATE_FORMAT(fechaModificacion, "%d/%m/%Y") AS fechaModificacionFormateada FROM blog WHERE id = ?', [id]
        );
        const blog = rows[0];
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el blog por ID:', error);
        res.status(500).json({ message: 'Error al obtener el blog' });
    }
};

// Actualizar un blog
const actualizarBlog = async (req, res) => {
    const { id } = req.params;
    const { titulo, resumen, contenido, urlImagen } = req.body; // Excluye el 'orden' de la actualización
    try {
        const [result] = await connection.query(
            'UPDATE blog SET titulo = ?, resumen = ?, contenido = ?, urlImagen = ?, fechaModificacion = CURRENT_TIMESTAMP WHERE id = ?',
            [titulo, resumen, contenido, urlImagen, id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Blog actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Blog no encontrado o no se realizaron cambios' });
        }
    } catch (error) {
        console.error('Error al actualizar el blog:', error);
        res.status(500).json({ message: 'Error al actualizar el blog' });
    }
};

// Eliminar un blog
const eliminarBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await connection.query(
            'DELETE FROM blog WHERE id = ?', [id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: 'Blog eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Blog no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el blog:', error);
        res.status(500).json({ message: 'Error al eliminar el blog' });
    }
};

// Agregar un nuevo blog
const agregarBlog = async (req, res) => {
    const { titulo, resumen, contenido, urlImagen } = req.body;
    try {
        const [result] = await connection.query(
            'INSERT INTO blog (titulo, resumen, contenido, urlImagen) VALUES (?, ?, ?, ?)',
            [titulo, resumen, contenido, urlImagen]
        );
        res.status(201).json({ id: result.insertId, message: 'Blog creado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el blog:', error);
        res.status(500).json({ message: 'Error al crear el blog' });
    }
};

// Actualizar el orden de los blogs
const actualizarOrdenBlogs = async (req, res) => {
    console.log("Cuerpo recibido:", req.body);

    const ordenData = req.body.orden;

    if (!ordenData || !Array.isArray(ordenData)) {
        return res.status(400).json({ error: "Se esperaba un array de objetos con 'id' y 'orden'" });
    }

    try {
        for (const item of ordenData) {
            const { id, orden } = item;

            // Verificar que 'id' y 'orden' sean números válidos
            if (isNaN(id) || isNaN(orden)) {
                console.error("Datos inválidos:", item);
                return res.status(400).json({ error: "Cada objeto debe tener 'id' y 'orden' como números válidos" });
            }

            // Actualizar solo el campo 'orden', no los demás campos
            const query = 'UPDATE blog SET `orden` = ? WHERE `id` = ?';
            const values = [parseInt(orden), parseInt(id)];  // Asegurarse de que sean números enteros

            console.log("Ejecutando consulta:", query, "con valores:", values);

            const [result] = await connection.query(query, values);
            console.log("Resultado de la actualización:", result);

            if (result.affectedRows === 0) {
                console.warn(`No se actualizó el registro con id: ${id}`);
            }
        }

        res.json({ message: 'Orden actualizado correctamente', ordenData });
    } catch (error) {
        console.error("Error al actualizar el orden:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    agregarBlog,
    obtenerBlogPorId,
    actualizarBlog,
    eliminarBlog,
    obtenerTodosLosBlogs,
    actualizarOrdenBlogs
};
