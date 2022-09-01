const Joi = require('@hapi/joi');

const logInSchemaVal = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(3).required(),
});

const signUpSchemaVal = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(3).required(),
});

module.exports = { signUpSchemaVal, logInSchemaVal };
