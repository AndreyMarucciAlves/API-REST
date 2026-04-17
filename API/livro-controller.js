const LivroService = require('./livro-service');
class LivroController {
    
    /**
     * Método para pegar todos os registros da tabela de livros.
     * Distingue o número de páginas, e o limite.
     */
    getTodos = async (req, res) => {
        try {
            const filtros = {
                nome: req.query.nome,
                pagina: req.query.pagina ? parseInt(req.query.pagina) : null,
                limite: req.query.limite ? parseInt(req.query.limite) : -1,
                ordem: req.query.ordem || 'ASC'
            };
            
            const livros = await LivroService.buscarTodos(filtros);
            res.json(livros);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    }

    getPorID = async (req, res) => {
        try {
            const livro = await LivroService.buscarPorId(req.params.id);
            res.json(livro);
        } catch (erro) {
            res.status(erro.status || 500).json({ erro: erro.message });
        }
    }

    create = async (req, res) => {
        try {
            const novo = await LivroService.criar(req.body);
            res.status(201).json(novo);
        } catch (erro) {
            res.status(erro.status || 400).json({ erro: erro.message });
        }
    }

    update = async (req, res) => {
        try {
            const atualizado = await LivroService.atualizar(req.params.id, req.body);
            res.json(atualizado);
        } catch (erro) {
            res.status(erro.status || 400).json({ erro: erro.message });
        }
    }

    delete = async (req, res) => {
        try {
            await LivroService.deletar(req.params.id);
            res.status(204).send();
        } catch (erro) {
            res.status(erro.status || 400).json({ erro: erro.message });
        }
    }
}

module.exports = new LivroController();