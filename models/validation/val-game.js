// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'title': joi.string().trim(),
    'createdBy': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'updatedBy': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(9999999999)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'title': keys.title.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'title': keys.title.optional(),
}).or('title');

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'title': keys.title.optional(),
    'createdBy': keys.createdBy.optional(),
    'updatedBy': keys.updatedBy.optional(),
    'page': keys.page,
    'limit': keys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.required(),
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'create': create,
    'id': id,
    'update': update,
    'search': search
};