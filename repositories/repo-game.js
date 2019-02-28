// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.game(request.body);

        await toBeIncluded.save();

        response.locals._UTIL.setLocalsData(
            response,
            201,
            toBeIncluded.toObject(),
            'Jogo salvo'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.game
                .find(
                    request.query,
                    { '_id': 1, 'name': 1, 'aggregated_rating': 1, 'sumary': 1, 'screenshots': 1 }
                )
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'createdAt': -1 })
                .exec(),

            response.locals._MODELS.game.find(request.query).countDocuments().exec()
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
        let foundObject = await response.locals._MODELS.game.findById(request.params._id);

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Jogo não encontrado', 'isNotFound': true });
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Jogo encontrado'
        );

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'findById': findById,
    'search': search
};

