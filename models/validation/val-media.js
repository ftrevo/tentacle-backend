// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'platform': joi.string().trim().valid('PS4', 'PS3', 'XBOXONE', 'XBOX360', 'NINTENDOSWITCH', 'NINTENDO3DS'),
    'game': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'owner': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'mineOnly': joi.boolean(),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'platform': keys.platform.required(),
    'game': keys.game.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'platform': keys.platform.required(),
    'game': keys.game.required()
});

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'platform': keys.platform.optional(),
    'game': keys.game.optional(),
    'owner': keys.owner.optional(),
    'mineOnly': keys.mineOnly.optional(),
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