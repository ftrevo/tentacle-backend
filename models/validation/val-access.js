// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------------- Objetos Locais --------------------- //
const accessKeys = {
    'email': joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
    'password': joi.string().min(5).trim(),
    'token': joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).trim()
};

// ------------------- Funções Exportadas ------------------- //
const login = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'email': accessKeys.email.required(),
    'password': accessKeys.password.required()
});

const refreshToken = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'refreshToken': accessKeys.token.required()
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'login': login,
    'refreshToken': refreshToken
};