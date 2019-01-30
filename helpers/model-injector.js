// --------------- Import de arquivos do core --------------- //
const library = require('../models/library').model;
const token = require('../models/token');
const media = require('../models/media');
const state = require('../models/state');
const game = require('../models/game');
const loan = require('../models/loan');
const user = require('../models/user');


// ------------------- Funções Exportadas ------------------- //
const injector = function (...modelNames) {
    return function (request, response, next) {
        response.locals._MODELS = {};

        for (let modelName of modelNames) {
            response.locals._MODELS[modelName] = getModel(modelName);
        }

        return next();
    };
};

// --------------------- Funções Locais --------------------- //
function getModel(modelName) {
    switch (modelName.toLowerCase()) {
        case 'user': return user;
        case 'token': return token;
        case 'state': return state;
        case 'game': return game;
        case 'media': return media;
        case 'library': return library;
        case 'loan': return loan;
    }
};

// --------------------- Module Exports --------------------- //
module.exports = injector;
