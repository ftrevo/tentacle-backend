// ----------------- Import de dependências ----------------- //
const joi = require('joi');

// --------------- Import de arquivos do core --------------- //
const valMediaLoan = require('../models/validation/val-media-loan');
const valLibrary = require('../models/validation/val-library');
const valAccess = require('../models/validation/val-access');
const valState = require('../models/validation/val-state');
const valMedia = require('../models/validation/val-media');
const valUser = require('../models/validation/val-user');
const valGame = require('../models/validation/val-game');
const valLoan = require('../models/validation/val-loan');
const valMessage = require('../models/validation/val-message');

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
        'create': valUser.create,
        'id': valUser.id,
        'update': valUser.update,
        'search': valUser.search,
        'forgotPwd': valUser.forgotPwd,
        'restorePwd': valUser.restorePwd
    },
    'access': {
        'login': valAccess.login,
        'refreshToken': valAccess.refreshToken
    },
    'state': {
        'id': valState.id
    },
    'game': {
        'create': valGame.create,
        'id': valGame.id,
        'update': valGame.update,
        'search': valGame.search,
        'searchRemote': valGame.searchRemote,
        'createRemote': valGame.createRemote
    },
    'media': {
        'create': valMedia.create,
        'id': valMedia.id,
        'update': valMedia.update,
        'search': valMedia.search
    },
    'library': {
        'id': valLibrary.id,
        'search': valLibrary.search,
        'searchHome': valLibrary.searchHome
    },
    'loan': {
        'create': valLoan.create,
        'id': valLoan.id,
        'update': valLoan.update,
        'search': valLoan.search
    },
    'mediaLoan': {
        'id': valMediaLoan.id,
        'search': valMediaLoan.search

    },
    'message': {
        'search': valMessage.search,
        'create': valMessage.create
    }
};

// --------------------- Module Exports --------------------- //
module.exports = validate;

