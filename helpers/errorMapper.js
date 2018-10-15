module.exports = (error, request, response, next) => {

    if (error.isJoi || error.isBusiness) {
        let errorStack;

        if (error.isBusiness) {
            if (Array.isArray(error.message)) {
                errorStack = error.message;
            } else {
                errorStack = [error.message];
            }
        } else {
            errorStack = error.details.map(detail => {
                if (detail.type.startsWith('string')) {
                    return `Dados inválidos para o campo \'${mapaObjetos[detail.context.key]}\'.`;
                }
                if (detail.type === 'any.required') {
                    return `O campo \'${mapaObjetos[detail.context.key]}\' é obrigatório.`;
                }
                if (detail.type === 'any.unknown') {
                    return `O campo \'${mapaObjetos[detail.context.key]}\' não pode ser informado para esta ação.`;
                }
                return detail.message;
            });
        }

        return response.locals._UTIL.handleRequests(400, { 'message': errorStack }, response);
    }

    console.log(error);
    response.locals._UTIL.handleRequests(500, { 'message': error.message }, response);
};

const mapaObjetos = {
    '_id': 'Identificador',
    'name': 'Nome',
    'email': 'E-mail',
    'phone': 'Telefone',
    'password': 'Senha',
    'createdAt': 'Criado em',
    'updatedAt': 'Atualizado em'
};