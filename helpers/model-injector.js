// --------------- Import de arquivos do core --------------- //
const library = require('../models/library').model;
const token = require('../models/token');
const media = require('../models/media');
const state = require('../models/state');
const game = require('../models/game');
const loan = require('../models/loan');
const user = require('../models/user');

// ------------------- Funções Exportadas ------------------- //
const injector = function (request, response, next) {
    response.locals._MODELS = {
        'user': user,
        'token': token,
        'state': state,
        'game': game.GameModel,
        'media': media,
        'library': library,
        'loan': loan
    };

    return next();
};

// --------------------- Module Exports --------------------- //
module.exports = injector;
