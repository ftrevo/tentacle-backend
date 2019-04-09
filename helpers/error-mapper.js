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

        return response.locals._UTIL.handleRequests(errorCode, response, { 'message': errorStack });
    }

    if (error.isAuthDenied) {
        return response.locals._UTIL.handleRequests(401, response);
    }

    if (error.isForbidden) {
        return response.locals._UTIL.handleRequests(403, response);
    }

    if (error.isOutdated) {
        return response.locals._UTIL.handleRequests(
            426,
            response,
            {
                'message': [`O aplicativo que você está utilizando está com a versão desatualizada (Versão ${request.headers['app-version']}). ` +
                    `Para voltar a ter acesso ao Tentacle, atualize para a versão ${process.env.APP_VERSION}`],
                'updateUrl': process.env.APP_DOWNLOAD_URL
            }
        );
    }

    if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
        return handleBodyParserParsingError(response);
    }

    console.log('------------------------------');
    console.log(error);
    console.log('------------------------------');
    response.locals._UTIL.handleRequests(500, response, { 'message': error.message });
};

// --------------------- Funções Locais --------------------- //
function getMessageFromDetail(detail) {
    if (detail.type.startsWith('string') || detail.type === 'any.allowOnly' ||
        detail.type === 'date.base' || detail.type === 'boolean.base' || detail.type === 'number.base') {
        return `Dados inválidos para o campo \'${fieldMap[detail.context.key]}\'.`;
    }
    if (detail.type === 'any.required') {
        return `O campo \'${fieldMap[detail.context.key]}\' é obrigatório.`;
    }
    if (detail.type === 'any.empty') {
        return `O campo \'${fieldMap[detail.context.key]}\' não pode ser vazio.`;
    }
    if (detail.type === 'any.unknown') {
        return `O campo \'${fieldMap[detail.context.key]}\' não pode ser informado para esta ação.`;
    }
    if (detail.type === 'object.missing') {
        return `Para esta ação você deve informar ao menos um dos seguintes campos: ${getFieldNames(detail.context.peers).join(', ')}.`
    }
    if (detail.type === 'number.max') {
        return `O campo \'${fieldMap[detail.context.key]}\' deve ser no máximo ${detail.context.limit}.`
    }

    return detail.message;
};

function getFieldNames(fieldArray) {
    return fieldArray.map(fieldName => fieldMap[fieldName]);
};

//Não tem o contexto do primeiro middleware de injeção do UTIL, por isso deve ser tratado de maneira diferente
function handleBodyParserParsingError(response) {
    return response.status(400).send({ 'message': 'Dados inválidos.' });
}

// --------------------- Objetos Locais --------------------- //
const fieldMap = {
    '_id': 'Identificador',
    'action': 'Ação',
    'city': 'Cidade',
    'createdAt': 'Criado em',
    'createdBy': 'Criado por',
    'email': 'E-mail',
    'game': 'Jogo',
    'id': 'Identificador',
    'limit': 'Limite',
    'mediaId': 'Identificador da Mídia',
    'mediaOwner': 'Dono da Mídia',
    'mediaPlatform': 'Plataforma',
    'mineOnly': 'Apenas meus',
    'name': 'Nome',
    'owner': 'Dono',
    'page': 'Página',
    'password': 'Senha',
    'phone': 'Telefone',
    'platform': 'Plataforma',
    'refreshToken': 'Refresh Token',
    'showHistory': 'Mostrar histórico',
    'state': 'Estado',
    'token': 'Token',
    'updatedAt': 'Atualizado em',
    'updatedBy': 'Atualizado por'
};

// --------------------- Module Exports --------------------- //
module.exports = handleErrors;
