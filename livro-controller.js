const LivroService = require('./livro-service');

class LivroController {
    getTodos = async (req, res) => {
        try {
            const livros = await LivroService.buscarTodos();
            res.json(livros);
        } catch (err) {
            res.status(err.status || 500).json({ erro: err.message });
        }
    }

    getPorID = async (req, res) => {
        try {
            const livro = await LivroService.buscarPorId(req.params.id);
            res.json(livro);
        } catch (err) {
            res.status(err.status || 500).json({ erro: err.message });
        }
    }

    create = async (req, res) => {
        try {
            const novo = await LivroService.criar(req.body);
            res.status(201).json(novo);
        } catch (err) {
            res.status(err.status || 400).json({ erro: err.message });
        }
    }

    update = async (req, res) => {
        try {
            const atualizado = await LivroService.atualizar(req.params.id, req.body);
            res.json(atualizado);
        } catch (err) {
            res.status(err.status || 400).json({ erro: err.message });
        }
    }

    delete = async (req, res) => {
        try {
            await LivroService.deletar(req.params.id);
            res.status(204).send();
        } catch (err) {
            res.status(err.status || 400).json({ erro: err.message });
        }
    }
}

module.exports = new LivroController();