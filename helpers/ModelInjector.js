// --------------- Import de arquivos do core --------------- //
const ModelUsuario = require('./Usuario').MongooseUsuarioModel;

module.exports = (...modelNames) => {
    return function (request, response, next) {
        response.locals._MODELS = {};

        for (let modelName of modelNames) {
            response.locals._MODELS[modelName] = getModel(modelName);
        }

        next();
    };
};

function getModel(modelName) {
    switch (modelName) {
        case 'Usuario': return ModelUsuario;
    }
};