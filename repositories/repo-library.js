// ------------------- Funções Exportadas ------------------- //
const aggregate = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.library.aggregate(request.query.aggregate);

        if (foundObject.length === 0) {
            if (request.query.endpoint === 'detail') {
                return next({ 'isDatabase': true, 'message': 'Jogo não encontrado', 'isNotFound': true });
            }

            foundObject = { 'count': 0, 'list': [] };
        }

        if (foundObject.length === 1) {
            foundObject = foundObject[0];
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject
        );

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'aggregate': aggregate
};

