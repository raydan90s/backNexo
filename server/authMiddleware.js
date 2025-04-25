const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer <token>"

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) {
            console.error("Token inválido o expirado", err);
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        req.usuario = usuario;
        next();
    });
};

module.exports = verificarToken;
