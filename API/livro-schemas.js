const Joi = require('joi');

const schemaCreateLivro = Joi.object({
    nome: Joi.string().min(4).required().messages({
        'string.empty': 'O nome do livro não pode estar vazio.',
        'string.min': 'O nome do livro deve ter pelo menos 2 caracteres.',
        'any.required': 'O nome do livro é obrigatório.'
    }),
    preco: Joi.number().positive().required().messages({
        'number.base': 'O preço deve ser um número.',
        'number.positive': 'O preço deve ser maior que zero.',
        'any.required': 'O preço é obrigatório.'
    }),
    categoria_id: Joi.number().integer().valid(1, 2, 3, 4).positive().required().messages({
        'number.base': 'O categoria_id deve ser um número.',
        'any.only': 'Categoria inválida. Escolha entre: 1 (Ficção científica), 2 (Romance), 3 (Acadêmico) ou 4 (Futebol).',
        'any.required': 'O categoria_id é obrigatório.'
    })
});

const schemaUpdateLivro = Joi.object({
    nome: Joi.string().min(4).optional().messages({
        'string.empty': 'O nome do livro não pode estar vazio.',
        'string.min': 'O nome do livro deve ter pelo menos 2 caracteres.',
    }),
    preco: Joi.number().positive().optional().messages({
        'number.base': 'O preço deve ser um número.',
        'number.positive': 'O preço deve ser maior que zero.',
    }),
    categoria_id: Joi.number().integer().valid(1, 2, 3, 4).positive().optional().messages({
        'number.base': 'O categoria_id deve ser um número.',
        'any.only': 'Categoria inválida. Escolha entre: 1 (Ficção científica), 2 (Romance), 3 (Acadêmico) ou 4 (Futebol).'
    })
})

function validarCriacaoLivro(req, res, next) {
    const validacao = schemaCreateLivro.validate(req.body);

    if (validacao.error) {
        return res.status(400).json({ 
            erro: 'Dados inválidos', 
            detalhe: validacao.error.details[0].message 
        });
    }

    next();
}

function validarAtualizacaoLivro(req, res, next){
    const validacao = schemaUpdateLivro.validate(req.body);

    if(validacao.error){
        return res.status(400).json({
            erro: 'Dados inválidos',
            detalhe: validacao.error.details[0].message
        })
    }

    next();
}

//Validação de id existente e válido na URL
function validarIdURL(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'O ID na URL deve ser um número.',
            'number.positive': 'O ID deve ser um número positivo.',
            'any.required': 'O ID é obrigatório na URL.'
        })
    });

    const { error } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({
            erro: 'ID inválido',
            detalhe: error.details[0].message
        });
    }

    next();
}
module.exports = { 
    validarCriacaoLivro,
    validarAtualizacaoLivro,
    validarIdURL
};
