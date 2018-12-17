// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------- Import de arquivos do core --------------- //
const userValidation = require('../models/validation/val-user');
const accessValidation = require('../models/validation/val-access');
const stateValidation = require('../models/validation/val-state');

// ------------------- Funções Exportadas ------------------- //
const validate = function (schemaName, functionValidation, requestObject) {
    return async function (request, response, next) {
        try {
            let validatedObject = await joi.validate(request[requestObject], validationMethods[schemaName][functionValidation]);

            //Sanitize or not
            if (requestObject !== 'params') {
                request[requestObject] = validatedObject;
            }
            next();
        } catch (error) {
            /* istanbul ignore next */
            return next(error);
        }
    };
};

// --------------------- Objetos Locais --------------------- //
const validationMethods = {
    'user': {
        'create': userValidation.create,
        'id': userValidation.id,
        'update': userValidation.update,
        'search': userValidation.search
    },
    'access': {
        'login': accessValidation.login,
        'refreshToken': accessValidation.refreshToken
    },
    'state': {
        'id': stateValidation.id
    },
};

// --------------------- Module Exports --------------------- //
module.exports = validate;

