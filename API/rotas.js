const express = require('express');
const router = express.Router();
const livroController = require('./livro-controller');

const { validarCriacaoLivro, validarAtualizacaoLivro,validarIdURL } = require('./livro-schemas'); 


router.get('/livros', livroController.getTodos);
router.get('/livros/:id', validarIdURL, livroController.getPorID);
router.post('/livros', validarCriacaoLivro, livroController.create);
router.put('/livros/:id', validarIdURL, validarAtualizacaoLivro, livroController.update);
router.delete('/livros/:id', validarIdURL, livroController.delete);

module.exports = router;