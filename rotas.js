const express = require('express');
const router = express.Router();
const livroController = require('./livro-controller');

router.get('/livros', livroController.getTodos);
router.get('/livros/:id', livroController.getPorID);
router.post('/livros', livroController.create);
router.put('/livros/:id', livroController.update);
router.delete('/livros/:id', livroController.delete);

module.exports = router;