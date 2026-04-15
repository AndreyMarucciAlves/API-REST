const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

/**
 * Função para validar os DTOS me possibilitando reutilização de código, me proporcionando um código limpo
 * @param {object} DTO DTO vindo da requisição
 * @returns {string|null} null se passou pelas validações, string com a informação da restrição caso contrário
 */
const validarLivro = (DTO) => {
    const { nome, preco, categoria } = DTO;
    if (!nome || typeof nome !== 'string' || nome.trim().length < 3) return "Nome inválido (mínimo 3 caracteres) ou vazio";
    if (preco === undefined || typeof preco !== 'number' || preco <= 0) return "Preço deve ser um número maior que 0 e é obrigatório";
    if (!categoria || typeof categoria !== 'string' || categoria.trim().length < 3) return "Categoria inválida ou inexistente";
    return null;
};


app.post('/api/livros', (req, res) => {
    const erroValidacao = validarLivro(req.body);
    if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

    const { nome, preco, categoria } = req.body;
    
    if (livros.some(l => l.nome.toLowerCase() === nome.trim().toLowerCase())) {
        return res.status(409).json({ erro: "Esse livro já está cadastrado." });
    }

    const novoLivro = { id: proximoId++, nome: nome.trim(), preco, categoria: categoria.trim() };
    livros.push(novoLivro);
    res.status(201).json(novoLivro);
});

app.get('/api/livros', (req, res) => {
    res.json(livros);
});

app.put('/api/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = livros.findIndex(l => l.id === id);

    if (index === -1) return res.status(404).json({ erro: "Livro não encontrado" });

    const erroValidacao = validarLivro(req.body);
    if (erroValidacao) return res.status(400).json({ erro: erroValidacao });

    const { nome, preco, categoria } = req.body;
    
    livros[index] = { id, nome: nome.trim(), preco, categoria: categoria.trim() };
    res.json(livros[index]);
});

app.delete('/api/livros/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = livros.findIndex(l => l.id === id);

    if (index === -1) return res.status(404).json({ erro: "Livro não encontrado." });

    livros.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, () => console.log('API na porta 3000'));