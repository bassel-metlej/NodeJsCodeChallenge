const Joi = require('@hapi/joi');

const createCategorySchemaVal = Joi.object({
    name: Joi.string().lowercase().required(),
    content: Joi.string().min(5).max(1000).required(),
});

const updateCategorySchemaVal = Joi.object({
    name: Joi.string().lowercase().required(),
    content: Joi.string().min(5).max(1000).required(),
});

module.exports = updateCategorySchemaVal;
