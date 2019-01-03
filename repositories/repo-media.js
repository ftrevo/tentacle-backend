// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.media(request.body);

        await toBeIncluded.save();
        await response.locals._MODELS.media.populate(toBeIncluded,
            [
                { 'path': 'owner', 'select': 'name' },
                { 'path': 'game', 'select': 'title' }
            ]
        );

        response.locals.message = 'Mídia salva no banco.';
        response.locals.statusCode = 201;

        response.locals.data = toBeIncluded.toObject();
        response.location(`/media/${response.locals.data._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let updated = await response.locals._MODELS.media.findOneAndUpdate(
            { '_id': request.params._id },
            request.body,
            { 'new': true }
        ).populate([
            { 'path': 'owner', 'select': 'name' },
            { 'path': 'game', 'select': 'title' }
        ]);

        response.locals.message = 'Mídia atualizada no banco.';
        response.locals.statusCode = 200;

        response.locals.data = updated.toObject();
        response.location(`/media/${response.locals.data._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.media.find(request.query)
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'owner': 1 })
                .populate([
                    { 'path': 'owner', 'select': 'name' },
                    { 'path': 'game', 'select': 'title' }
                ])
                .exec(),

            response.locals._MODELS.media.find(request.query).countDocuments().exec()
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
        let foundObject = await response.locals._MODELS.media.findById(request.params._id)
            .populate([
                { 'path': 'owner', 'select': 'name' },
                { 'path': 'game', 'select': 'title' }
            ]);

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Mídia não encontrada', 'isNotFound': true });
        }

        response.locals.data = foundObject;
        response.locals.message = 'Mídia encontrada';
        response.locals.statusCode = 200;

        response.location(`/media/${request.params._id}`);

        next();
    } catch (error) {
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let foundObject = await response.locals._MODELS.media.findByIdAndDelete(request.params._id);

        response.locals.data = foundObject;
        response.locals.message = 'Mídia removida';
        response.locals.statusCode = 200;
        response.location(`/media/${request.params._id}`);

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

