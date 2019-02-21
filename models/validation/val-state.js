// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const stateKeys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/)
};

// ------------------- Funções Exportadas ------------------- //
const id = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': stateKeys._id.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'id': id
};
