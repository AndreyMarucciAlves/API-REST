const Joi = require('joi');

const authSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'O nome de usuário deve ter pelo menos 3 caracteres.',
            'any.required': 'O nome de usuário é obrigatório.'
        }),
    password: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'A senha deve ter pelo menos 3 caracteres.',
            'any.required': 'A senha é obrigatória.'
        })
});

const validarAuth = (req, res, next) => {
    const { error } = authSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }
    next();
};

module.exports = { validarAuth };