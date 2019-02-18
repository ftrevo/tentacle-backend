// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        request.query.owner = response.locals._USER._id;

        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);
        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};
// --------------------- Module Exports --------------------- //
module.exports = {
    'search': search
};
