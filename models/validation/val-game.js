// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'id': joi.number(),
    'name': joi.string().trim(),
    'createdBy': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'updatedBy': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': keys.name.required()
});

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'name': keys.name.optional(),
    'createdBy': keys.createdBy.optional(),
    'updatedBy': keys.updatedBy.optional(),
    'page': keys.page,
    'limit': keys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.required()
});

const searchRemote = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': keys.name.required(),
    'page': joi.number().default(0),
    'limit': joi.number().default(25).max(50)
});

const createRemote = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'id': keys.id.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'create': create,
    'createRemote': createRemote,
    'id': id,
    'search': search,
    'searchRemote': searchRemote
};
