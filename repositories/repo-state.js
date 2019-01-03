// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        let stateList = await response.locals._MODELS.state.find({}, { 'cities': 0 }).sort({ 'name': 1 }).exec();

        response.locals._UTIL.setLocalsData(
            response,
            200,
            { 'list': stateList }
        );

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

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Estado encontrado'
        );

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

