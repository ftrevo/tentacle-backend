// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.library.
                find(
                    request.query,
                    'name ' +
                    'mediaPs3Count mediaPs4Count mediaXbox360Count mediaXboxOneCount mediaNintendo3dsCount mediaNintendoSwitchCount'
                )
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort('name')
                .exec(),

            response.locals._MODELS.library.find(request.query).countDocuments().exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            { 'list': resolvedPromisses[0], 'count': resolvedPromisses[1] }
        );

        next();
    } catch (error) {
        next(error);
    }
};

const findById = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.library.findById(request.params._id);

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Jogo não encontrado', 'isNotFound': true });
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
    'search': search,
    'findById': findById
};

