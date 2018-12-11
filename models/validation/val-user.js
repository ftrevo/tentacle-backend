// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const userKeys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'name': joi.string().uppercase().trim(),
    'email': joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
    'phone': joi.string().trim().regex(/^\d{2} \d{8,9}$/),
    'password': joi.string().min(5).trim(),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(9999999999)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': userKeys.name.required(),
    'email': userKeys.email.required(),
    'phone': userKeys.phone.required(),
    'password': userKeys.password.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': userKeys.name.optional(),
    'email': userKeys.email.optional(),
    'phone': userKeys.phone.optional(),
    'password': userKeys.password.optional()
}).or('name', 'email', 'phone', 'password');

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': userKeys._id.optional(),
    'name': userKeys.name.optional(),
    'email': userKeys.email.optional(),
    'phone': userKeys.phone.optional(),
    'page': userKeys.page,
    'limit': userKeys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': userKeys._id.required(),
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'create': create,
    'id': id,
    'update': update,
    'search': search
};