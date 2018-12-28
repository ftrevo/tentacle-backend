// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'platform': joi.string().trim().valid('PS4', 'PS3', 'XBOX ONE', 'XBOX 360', 'NINTENDO SWITCH', 'NINTENDO 3DS'),
    'game': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'owner': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(9999999999)
};

// ------------------- Funções Exportadas ------------------- //
const create = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'platform': keys.platform.required(),
    'game': keys.game.required()
});

const update = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'platform': keys.platform.optional(),
    'game': keys.game.optional()
}).or('platform', 'game');

const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'platform': keys.platform.optional(),
    'game': keys.game.optional(),
    'owner': keys.owner.optional(),
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