// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------- Import de arquivos do core --------------- //
const userJoi = require('../models/user').joi;

// ------------------- Funções Exportadas ------------------- //
const validate = function (schemaName, functionValidation, requestObject) {
    return async function (request, response, next) {
        let validatedObject = await joi.validate(request[requestObject], validationMethods[schemaName][functionValidation]);

        if (validatedObject && validatedObject.error) {
            return next(validatedObject.error);
        }

        //Sanitize or not
        if(requestObject !== 'params'){
            request[requestObject] = validatedObject;
        }
        next();
    };
};

// --------------------- Objetos Locais --------------------- //
const validationMethods = {
    'user': {
        'create': userJoi.create,
        '_id': userJoi.id,
        'update': userJoi.update,
        'search': userJoi.search
    }
};

// --------------------- Module Exports --------------------- //
module.exports = validate;

