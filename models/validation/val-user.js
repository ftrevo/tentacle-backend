// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'name': joi.string().trim(),
    'email': joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
    'phone': joi.string().trim().regex(/^\d{2} \d{8,9}$/),
    'password': joi.string().min(5).trim(),
    'state': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'city': joi.string().trim(),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'token': joi.string().regex(/^[0-9A-Z]{5}$/),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': keys.name.required(),
    'email': keys.email.required(),
    'phone': keys.phone.required(),
    'password': keys.password.required(),
    'state': keys.state.required(),
    'city': keys.city.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': keys.name.optional(),
    'email': keys.email.optional(),
    'phone': keys.phone.optional(),
    'password': keys.password.optional(),
    'state': keys.state.optional(),
    'city': keys.city.optional()
}).or('name', 'email', 'phone', 'password', 'state', 'city');

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'name': keys.name.optional(),
    'email': keys.email.optional(),
    'phone': keys.phone.optional(),
    'state': keys.state.optional(),
    'city': keys.city.optional(),
    'page': keys.page,
    'limit': keys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.required()
});

const forgotPwd = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': keys.email.required()
});

const restorePwd = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': keys.email.required(),
    'token': keys.token.required(),
    'password': keys.password.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'create': create,
    'id': id,
    'update': update,
    'search': search,
    'forgotPwd': forgotPwd,
    'restorePwd': restorePwd
};
