const express = require('express');
const rotas = require('./rotas');

const app = express();
app.use(express.json());

app.use('/api', rotas);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor on: http://localhost:${PORT}/api/livros`);
});