// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------- Import de arquivos do core --------------- //
const userJoi = require('../models/user').joi;

// ------------------- Funções Exportadas ------------------- //
const validate = function (schemaName, functionValidation, requestObject) {
    return function (request, response, next) {
        const { error } = joi.validate(request[requestObject], validationMethods[schemaName][functionValidation]);

        return next(error);
    };
};

// --------------------- Objetos Locais --------------------- //
const validationMethods = {
    'user': {
        'create': userJoi.create,
        'id': userJoi.id,
        'update': userJoi.update,
        'search': userJoi.search
    }
};

// --------------------- Module Exports --------------------- //
module.exports = validate;

