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

const searchHome = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.library.
                find(
                    request.query,
                    { 
                        '_id': 1, 'name': 1, 'aggregated_rating': 1, 'summary': 1, 'screenshots': 1, 
                        'mediaPs3Count': 1, 'mediaPs4Count': 1, 'mediaXbox360Count': 1, 'mediaXboxOneCount': 1, 'mediaNintendo3dsCount': 1, 'mediaNintendoSwitchCount': 1  
                    }
                )
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'createdAt': -1 })
                .exec(),

            response.locals._MODELS.library.find(request.query).countDocuments().exec()
        ];

        let resolvedPromisses =  await Promise.all(promisseStack);

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

const findById =  async function (request, response, next) {
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
    'searchHome': searchHome,
    'findById': findById
};

