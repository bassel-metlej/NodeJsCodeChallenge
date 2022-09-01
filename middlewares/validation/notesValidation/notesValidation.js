const Joi = require('@hapi/joi');

const creteNoteSchemaVal = Joi.object({
    title: Joi.string().lowercase().required(),
    description: Joi.string().min(5).max(100).required(),
    categoryID: Joi.string().required(),
    tagIDs: Joi.array().required(),
});

const updateNoteSchemaVal = Joi.object({
    title: Joi.string().lowercase().required(),
    description: Joi.string().min(5).max(100).required(),
});

module.exports = { creteNoteSchemaVal, updateNoteSchemaVal };
