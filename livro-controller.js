const express = require('express');
const app = express();
app.use(express.json());

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