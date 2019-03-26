// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'platform': joi.string().trim().valid('PS4', 'PS3', 'XBOXONE', 'XBOX360', 'NINTENDOSWITCH', 'NINTENDO3DS'),
    'game': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'active': joi.boolean(),
    'page': joi.number().default(0),
    'limit': joi.number().default(10).max(100)
};

// ------------------- Funções Exportadas ------------------- //
const search = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.optional(),
    'platform': keys.platform.optional(),
    'game': keys.game.optional(),
    'active': keys.active.optional(),
    'page': keys.page,
    'limit': keys.limit
});

const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': keys._id.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'id': id,
    'search': search
};
