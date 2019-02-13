// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.media(request.body);

        await toBeIncluded.save();
        await response.locals._MODELS.media.populate(toBeIncluded,
            [
                { 'path': 'owner', 'select': 'name' },
                { 'path': 'game', 'select': 'name' }
            ]
        );

        response.locals._UTIL.setLocalsData(
            response,
            201,
            toBeIncluded.toObject(),
            'Mídia salva'
        );

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
            { 'path': 'game', 'select': 'name' }
        ]);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            updated.toObject(),
            'Mídia atualizada'
        );

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
                    { 'path': 'game', 'select': 'name' }
                ])
                .exec(),

            response.locals._MODELS.media.find(request.query).countDocuments().exec()
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
        let foundObject = await response.locals._MODELS.media.findById(request.params._id)
            .populate([
                { 'path': 'owner', 'select': 'name' },
                { 'path': 'game', 'select': 'name' }
            ]);

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Mídia não encontrada', 'isNotFound': true });
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Mídia encontrada'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let removedObject = await response.locals._MODELS.media.findByIdAndDelete(request.params._id);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            removedObject,
            'Mídia removida'
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

