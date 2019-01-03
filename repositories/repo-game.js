// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.game(request.body);

        await toBeIncluded.save();
        await response.locals._MODELS.game.populate(toBeIncluded, { 'path': 'createdBy', 'select': 'name' });

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

const update = async function (request, response, next) {
    try {
        let updated = await response.locals._MODELS.game.findOneAndUpdate(
            { '_id': request.params._id },
            request.body,
            { 'new': true }
        ).populate([
            { 'path': 'createdBy', 'select': 'name' },
            { 'path': 'updatedBy', 'select': 'name' }
        ]);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            updated.toObject(),
            'Jogo atualizado'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.game.find(request.query)
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'title': 1 })
                .populate([
                    { 'path': 'createdBy', 'select': 'name' },
                    { 'path': 'updatedBy', 'select': 'name' }
                ])
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
        let foundObject = await response.locals._MODELS.game.findById(request.params._id)
            .populate([
                { 'path': 'createdBy', 'select': 'name' },
                { 'path': 'updatedBy', 'select': 'name' }
            ]);

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

const remove = async function (request, response, next) {
    try {
        let removedObject = await response.locals._MODELS.game.findByIdAndDelete(request.params._id);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            removedObject,
            'Jogo removido'
        );

        next();
    } catch (error) {
        next(error);
    }
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'findById': findById,
    'remove': remove,
    'search': search
};

