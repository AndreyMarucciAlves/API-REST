const DBManager = require('./data/DBManager');

class LivroService {
    async buscarTodos() {
        return await DBManager.buscarTodos();
    }

    async buscarPorId(id) {
        const livro = await DBManager.buscarPorId(id);
        if (!livro) throw { status: 404, message: "Livro não encontrado." };
        return livro;
    }

    async criar(dados) {
        const { nome, preco, categoria } = dados;
        this.validar(dados);

        const existe = await DBManager.buscarPorNome(nome);
        if (existe) throw { status: 409, message: "Este livro já existe." };

        return await DBManager.inserir(nome.trim(), preco, categoria.trim());
    }

    async atualizar(id, dados) {
        await this.buscarPorId(id); 
        this.validar(dados);
        return await DBManager.atualizar(id, dados.nome.trim(), dados.preco, dados.categoria.trim());
    }

    async deletar(id) {
        await this.buscarPorId(id);
        return await DBManager.deletar(id);
    }

    validar(dados) {
        if (!dados.nome || dados.nome.length < 2) throw { status: 400, message: "Nome inválido." };
        if (typeof dados.preco !== 'number' || dados.preco <= 0) throw { status: 400, message: "Preço deve ser maior que zero." };
        if (!dados.categoria) throw { status: 400, message: "Categoria obrigatória." };
    }
}

module.exports = new LivroService();