const jwt = require('jsonwebtoken');
const SECRET = 'segredo';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ erro: 'Você não está logado.' });

    const token = authHeader.split(' ')[1]; 

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ erro: 'Token inválido ou expirado.' });
        req.userId = decoded.id;
        next();
    });
};