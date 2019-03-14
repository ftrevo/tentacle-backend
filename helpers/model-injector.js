// --------------- Import de arquivos do core --------------- //
const library = require('../models/library');
const token = require('../models/token');
const media = require('../models/media');
const state = require('../models/state');
const game = require('../models/game');
const loan = require('../models/loan');
const user = require('../models/user');
const message = require('../models/message')
const mediaLoan = require('../models/media-loan');

// ------------------- Funções Exportadas ------------------- //
const injector = function (request, response, next) {
    response.locals._MODELS = {
        'user': user,
        'token': token,
        'state': state,
        'game': game.model,
        'media': media,
        'library': library.model,
        'loan': loan,
        'mediaLoan': mediaLoan.model,
        'message': message
    };

    return next();
};

// --------------------- Module Exports --------------------- //
module.exports = injector;
