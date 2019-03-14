// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    'action': joi.string().trim(),
    'title': joi.string().trim(),
    'detail': joi.string().trim(),
    'recipient': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'action': keys.action.required(),
    'title': keys.title.required(),
    'detail': keys.detail.required(),
    'recipient': keys.recipient.required()
});

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'page': keys.page,
    'limit': keys.limit
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'search': search,
    'create': create
};
