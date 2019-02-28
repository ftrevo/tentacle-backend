// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const userKeys = {
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
    'name': userKeys.name.required(),
    'email': userKeys.email.required(),
    'phone': userKeys.phone.required(),
    'password': userKeys.password.required(),
    'state': userKeys.state.required(),
    'city': userKeys.city.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': userKeys.name.optional(),
    'email': userKeys.email.optional(),
    'phone': userKeys.phone.optional(),
    'password': userKeys.password.optional(),
    'state': userKeys.state.optional(),
    'city': userKeys.city.optional()
}).or('name', 'email', 'phone', 'password', 'state', 'city');

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': userKeys._id.optional(),
    'name': userKeys.name.optional(),
    'email': userKeys.email.optional(),
    'phone': userKeys.phone.optional(),
    'state': userKeys.state.optional(),
    'city': userKeys.city.optional(),
    'page': userKeys.page,
    'limit': userKeys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': userKeys._id.required()
});

const forgotPwd = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': userKeys.email.required()
});

const restorePwd = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': userKeys.email.required(),
    'token': userKeys.token.required(),
    'password': userKeys.password.required()
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
