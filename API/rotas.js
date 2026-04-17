const express = require('express');
const router = express.Router();
const livroController = require('./livro-controller');
const authController = require('./auth-controller');
const verificarJWT = require('./auth-middleware');

const { 
    validarCriacaoLivro, 
    validarAtualizacaoLivro, 
    validarIdURL 
} = require('./livro-schemas'); 


router.post('/registrar', authController.registrar);
router.post('/login', authController.login);


router.get('/livros', verificarJWT, livroController.getTodos); 
router.get('/livros/:id', verificarJWT, validarIdURL, livroController.getPorID);
router.post('/livros', verificarJWT, validarCriacaoLivro, livroController.create);
router.put('/livros/:id', verificarJWT, validarIdURL, validarAtualizacaoLivro, livroController.update);
router.delete('/livros/:id', verificarJWT, validarIdURL, livroController.delete);

module.exports = router;