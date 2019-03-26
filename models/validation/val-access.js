// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const keys = {
    'email': joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
    'password': joi.string().min(5).trim(),
    'refreshToken': joi.string().regex(
        /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\.[0-9A-F]{24}\.[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i).trim(),
    'deviceToken': joi.string().trim()
};

// ------------------- Funções Exportadas ------------------- //
const login = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': keys.email.required(),
    'password': keys.password.required()
});

const refreshToken = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'refreshToken': keys.refreshToken.required()
});

const deviceToken = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'deviceToken': keys.deviceToken.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'login': login,
    'refreshToken': refreshToken,
    'deviceToken': deviceToken
};
