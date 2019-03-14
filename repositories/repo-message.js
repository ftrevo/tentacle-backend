// ------------------- Funções Exportadas ------------------- //

const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.message(request.body);

        await toBeIncluded.save();

        response.locals._UTIL.setLocalsData(
            response,
            201,
            toBeIncluded.toObject(),
            'Mensagem salva'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.message
                .find(request.query)
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .exec(),

            response.locals._MODELS.message.find(request.query).countDocuments().exec()
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
}

const findById = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.message
            .findById(request.params._id)
            .populate(
                [
                    { 'path': 'recipient', 'select': 'name email' }
                ]
            );

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Mensagem não encontrada', 'isNotFound': true });
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Mensagem encontrada'
        );

        next();
    } catch (error) {
        next(error);
    }
}

const remove = async function (request, response, next) {
    try {

        let removedObject = await response.locals._MODELS.media.findByIdAndDelete(request.params._id);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            removedObject,
            'Mensagem removida'
        );

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'search': search,
    'findById': findById,
    'save': save,
    'remove': remove
};