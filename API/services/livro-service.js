const DBManager = require('../../data/DBManager');

class LivroService {
    
    async buscarTodos(filtros = {}) {
        const { nome, pagina, limite, ordem } = filtros;
        
        const offset = (pagina && limite > 0) ? (pagina - 1) * limite : 0;

        return await DBManager.buscarTodos(nome, limite, offset, ordem);
    }

    async buscarPorId(id) {
        const livro = await DBManager.buscarPorId(id);
        if (!livro) throw { status: 404, message: "Livro não encontrado." };
        return livro;
    }

    async criar(dados) {
        const { nome, preco, categoria_id } = dados;
        this.validar(dados); 

        const existe = await DBManager.buscarPorNome(nome);
        if (existe) throw { status: 409, message: "Este livro já existe." };

        return await DBManager.inserir(nome.trim(), preco, categoria_id);
    }

    async atualizar(id, dados) {
        const livroAtual = await this.buscarPorId(id);

        if(dados.nome){
            const existe = await DBManager.buscarPorNome(dados.nome);
            if (existe) throw { status: 409, message: "Este livro já existe." };
        }
        
        const nomeFinal = dados.nome ? dados.nome.trim() : livroAtual.nome;
        const precoFinal = (dados.preco !== undefined && dados.preco !== null) ? dados.preco : livroAtual.preco;
        const categoriaFinal = dados.categoria_id || livroAtual.categoria_id;

        return await DBManager.atualizar(id, nomeFinal, precoFinal, categoriaFinal);
    }

    async deletar(id) {
        await this.buscarPorId(id);
        return await DBManager.deletar(id);
    }

    validar(dados) {
        if (!dados.nome || dados.nome.length < 2) throw { status: 400, message: "Nome inválido." };
        if (typeof dados.preco !== 'number' || dados.preco <= 0) throw { status: 400, message: "Preço deve ser maior que zero." };
        if (!dados.categoria_id) throw { status: 400, message: "Categoria obrigatória." };
    }
}

module.exports = new LivroService();