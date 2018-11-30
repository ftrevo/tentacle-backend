// --------------- Import de arquivos do core --------------- //
const user = require('../models/user').MongooseModel;

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
    switch (modelName) {
        case 'User': return user;
    }
};

// --------------------- Module Exports --------------------- //
module.exports = injector;