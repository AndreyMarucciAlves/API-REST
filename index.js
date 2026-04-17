const express = require('express');
const rotas = require('./API/core/rotas');

const app = express();
app.use(express.json());

//Middleware para capturar erros de sintaxe em JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            erro: "Formato JSON inválido.", 
            detalhe: "Verifique se há erros de sintaxe no corpo da requisição." 
        });
    }
    next();
});

app.use('/api', rotas);

//Middleware para rotas não encontradas, feito para garantir que o sistema retorne um JSON ao invés de HTML quando
//o id vier faltando na requisição.
app.use((req, res) => {
    res.status(404).json({
        erro: "Rota não encontrada",
        detalhe: `O caminho ${req.originalUrl} para o método ${req.method} não existe.Verifique se esqueceu o ID na URL ou se a rota existe.`
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor on: http://localhost:${PORT}/api/livros`);
});