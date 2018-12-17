// --------------- Import de arquivos do core --------------- //
const user = require('../models/user');
const token = require('../models/token');
const state = require('../models/state');

// ------------------- Funções Exportadas ------------------- //
const injector = function (...modelNames) {
    return function (request, response, next) {
        response.locals._MODELS = {};

        for (let modelName of modelNames) {
            response.locals._MODELS[modelName] = getModel(modelName);
        }

        next();
    };
};

// --------------------- Funções Locais --------------------- //
function getModel(modelName) {
    switch (modelName.toLowerCase()) {
        case 'user': return user;
        case 'token': return token;
        case 'state': return state;
    }
};

// --------------------- Module Exports --------------------- //
module.exports = injector;