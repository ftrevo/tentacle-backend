// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        let stateList = await response.locals._MODELS.state.find({}, { 'cities': 0 }).sort({ 'name': 1 }).exec();

        response.locals.statusCode = 200;
        response.locals.data = { 'list': stateList };

        next();
    } catch (error) {
        next(error);
    }
};

const findById = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.state.findById(request.params._id, { 'cities': 1 }).sort({ 'cities': 1 }).exec();

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Estado não encontrado', 'isNotFound': true });
        }

        response.locals.data = foundObject;
        response.locals.message = 'Estado encontrado';
        response.locals.statusCode = 200;

        response.location(`/states/${request.params._id}/cities`);

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'findById': findById,
    'search': search
};

