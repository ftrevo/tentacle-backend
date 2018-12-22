// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.game(request.body);

        await toBeIncluded.save();
        await response.locals._MODELS.game.populate(toBeIncluded, { 'path': 'createdBy', 'select': 'name' });

        response.locals.message = 'Jogo salvo no banco.';
        response.locals.statusCode = 201;

        response.locals.data = toBeIncluded.toObject();
        response.location(`/games/${response.locals.data._id}`);

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

        response.locals.message = 'Jogo atualizado no banco.';
        response.locals.statusCode = 200;

        response.locals.data = updated.toObject();
        response.location(`/games/${response.locals.data._id}`);

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

        response.locals.statusCode = 200;
        response.locals.data = { 'list': resolvedPromisses[0], 'count': resolvedPromisses[1] };

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

        response.locals.data = foundObject;
        response.locals.message = 'Jogo encontrado';
        response.locals.statusCode = 200;

        response.location(`/games/${request.params._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.game.findByIdAndDelete(request.params._id);

        response.locals.data = foundObject;
        response.locals.message = 'Jogo removido';
        response.locals.statusCode = 200;
        response.location(`/games/${request.params._id}`);

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

