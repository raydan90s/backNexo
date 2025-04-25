// usuario.js
const connection = require('./db'); // Importa la conexión a la base de datos
const bcrypt = require('bcryptjs');

const obtenerUsuarioPorEmail = async (email) => {
    try {
        const [rows] = await connection.promise().query('SELECT * FROM usuario WHERE correo = ? AND estado = TRUE', [email]);
        return rows[0]; // Devuelve el primer usuario activo encontrado con ese email
    } catch (error) {
        console.error('Error al obtener usuario por email:', error);
        throw error; // Re-lanza el error para que lo maneje el controlador
    }
};

const verificarCredenciales = async (email, password) => {
    try {
        const usuario = await obtenerUsuarioPorEmail(email);
        if (!usuario) {
            console.log('Usuario no encontrado o inactivo');
            return null; // Usuario no encontrado o inactivo
        }

        console.log('Usuario encontrado:', usuario.correo);

        const passwordMatch = await bcrypt.compare(password, usuario.password);
        console.log('Contraseña comparada:', passwordMatch); // Ver si la comparación es correcta

        if (passwordMatch) {
            return usuario; // Credenciales válidas, devuelve el usuario activo
        } else {
            console.log('Contraseña incorrecta');
            return null; // Contraseña incorrecta
        }
    } catch (error) {
        console.error('Error al verificar credenciales:', error);
        throw error; // Re-lanza el error para que lo maneje el controlador
    }
};

const crearNuevoUsuario = async (correo, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await connection.promise().query(
            'INSERT INTO usuario (correo, password) VALUES (?, ?)',
            [correo, hashedPassword]
        );
        return result.insertId; // Devuelve el ID del nuevo usuario insertado
    } catch (error) {
        console.error('Error al crear nuevo usuario:', error);
        throw error; // Re-lanza el error para que lo maneje el controlador
    }
};

module.exports = { obtenerUsuarioPorEmail, verificarCredenciales, crearNuevoUsuario };