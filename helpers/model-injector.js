// --------------- Import de arquivos do core --------------- //
const library = require('../models/library');
const token = require('../models/token');
const media = require('../models/media');
const state = require('../models/state');
const game = require('../models/game');
const loan = require('../models/loan');
const user = require('../models/user');
const tenancy = require('../models/tenancy');

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
        'tenancy': tenancy.model
    };

    return next();
};

// --------------------- Module Exports --------------------- //
module.exports = injector;
