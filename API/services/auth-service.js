const bcrypt = require('bcryptjs');
const DBManager = require('../../data/DBManager');

class AuthService {
    async registrar(username, password) {
        const usuarioExistente = await DBManager.buscarUsuario(username);
        if (usuarioExistente) {
            throw { status: 409, message: "Usuário já cadastrado." };
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(password, salt);

        return await DBManager.inserirUsuario(username, senhaHash);
    }

    async validarLogin(username, password) {
        const usuario = await DBManager.buscarUsuario(username);
        if (!usuario) return null;

        const senhaValida = await bcrypt.compare(password, usuario.password);
        return senhaValida ? usuario : null;
    }
}

module.exports = new AuthService();