// ----------------- Import de dependências ----------------- //
const Joi = require('joi');

// --------------- Import de arquivos do core --------------- //
const SchemaUsuario = require('./Usuario');

// Função exportada
module.exports = (schemaName, functionValidation, requestObject) => {
    return function (request, response, next) {
        const { error } = Joi.validate(request[requestObject], validationMethods[schemaName][functionValidation]);

        return next(error);
    };
};

//Estruturação do objeto de funções de validação
const validationMethods = {
    'Usuario': {
        'criacao': SchemaUsuario.JoiUsuarioCriacao,
        'atualizacao': SchemaUsuario.JoiUsuarioAtualizacao,
        'consulta': SchemaUsuario.JoiUsuarioConsulta
    }
};

