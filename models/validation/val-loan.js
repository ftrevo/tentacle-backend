// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'requestedBy': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'requestedAt': joi.date().raw(),
    'estimatedReturnDate': joi.date().raw(),
    'media': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'mediaOwner': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'game': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'loanDate': joi.date().raw(),
    'returnDate': joi.date().raw(),
    'action': joi.string().trim().uppercase().valid('LEND', 'RETURN'),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'media': keys.media.required()
});

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'requestedBy': keys.requestedBy.optional(),
    'media': keys.media.optional(),
    'mediaOwner': keys.mediaOwner.optional(),
    'game': keys.mediaOwner.optional(),
    'page': keys.page,
    'limit': keys.limit
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'action': keys.action.required()
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'create': create,
    'id': id,
    'search': search,
    'update': update
};
