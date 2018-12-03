// ------------------- Funções Exportadas ------------------- //
const handleErrors = function (error, request, response, next) {
    if (error.isJoi || error.isBusiness || error.isDatabase) {
        let errorCode = 400;
        let errorStack;

        if (error.isNotFound) {
            errorCode = 404;
        }

        if (error.isBusiness || error.isDatabase) {
            if (Array.isArray(error.message)) {
                errorStack = error.message;
            } else {
                errorStack = [error.message];
            }
        } else {
            errorStack = error.details.map(getMessageFromDetail);
        }

        return response.locals._UTIL.handleRequests(errorCode, { 'message': errorStack }, response);
    }

    console.log(error);
    response.locals._UTIL.handleRequests(500, { 'message': error.message }, response);
};

// --------------------- Funções Locais --------------------- //
function getMessageFromDetail(detail) {
    if (detail.type.startsWith('string') || detail.type === 'date.base') {
        return `Dados inválidos para o campo \'${fieldMap[detail.context.key]}\'.`;
    }
    if (detail.type === 'any.required') {
        return `O campo \'${fieldMap[detail.context.key]}\' é obrigatório.`;
    }
    if (detail.type === 'any.unknown') {
        return `O campo \'${fieldMap[detail.context.key]}\' não pode ser informado para esta ação.`;
    }

    return detail.message;
}

// --------------------- Objetos Locais --------------------- //
const fieldMap = {
    '_id': 'Identificador',
    'name': 'Nome',
    'email': 'E-mail',
    'phone': 'Telefone',
    'password': 'Senha',
    'createdAt': 'Criado em',
    'updatedAt': 'Atualizado em'
};

// --------------------- Module Exports --------------------- //
module.exports = handleErrors;