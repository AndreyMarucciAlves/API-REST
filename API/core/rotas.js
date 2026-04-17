const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livro-controller');
const authController = require('../controllers/auth-controller');
const verificarJWT = require('./auth-middleware');
const { validarAuth } = require('../schemas/auth-schema');
const { 
    validarCriacaoLivro, 
    validarAtualizacaoLivro, 
    validarIdURL 
} = require('../schemas/livro-schemas'); 


router.post('/registrar', validarAuth, authController.registrar);
router.post('/login', validarAuth, authController.login);


router.get('/livros', verificarJWT, livroController.getTodos); 
router.get('/livros/:id', verificarJWT, validarIdURL, livroController.getPorID);
router.post('/livros', verificarJWT, validarCriacaoLivro, livroController.create);
router.put('/livros/:id', verificarJWT, validarIdURL, validarAtualizacaoLivro, livroController.update);
router.delete('/livros/:id', verificarJWT, validarIdURL, livroController.delete);

module.exports = router;