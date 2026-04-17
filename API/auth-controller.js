const AuthService = require('./auth-service');
const jwt = require('jsonwebtoken');
const SECRET = 'segredo';

class AuthController {
    registrar = async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) throw { status: 400, message: "Dados incompletos." };
            
            await AuthService.registrar(username, password);
            res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
        } catch (erro) {
            res.status(erro.status || 500).json({ erro: erro.message });
        }
    }

    login = async (req, res) => {
        try {
            const { username, password } = req.body;
            const usuario = await AuthService.validarLogin(username, password);

            if (!usuario) {
                return res.status(401).json({ erro: "Usuário ou senha inválidos." });
            }

            const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    }
}

module.exports = new AuthController();