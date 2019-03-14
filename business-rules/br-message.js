// ------------------- Funções Exportadas ------------------- //

const search = async function (request, response, next) {
    try {

        request.query.recipient = response.locals._USER._id;

        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);
        next();

    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let message = await response.locals._MODELS.message.findById(request.params._id).exec();

        if (!message) {
            return next({ 'isBusiness': true, 'message': 'Mensagem não encontrada' });
        }

        if (message.recipient.toString() !== response.locals._USER._id.toString()) {
            return next({ 'isForbidden': true });
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};


// --------------------- Module Exports --------------------- //
module.exports = {
    'search': search,
    'remove': remove
};