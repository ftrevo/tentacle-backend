// --------------------- Objetos Locais --------------------- //
const populateFields = [
    { 'path': 'requestedBy mediaOwner', 'select': 'name email' },
    { 'path': 'media', 'select': 'platform' },
    { 'path': 'game', 'select': 'name cover formattedReleaseDate' }
];

// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.loan(request.body);

        await toBeIncluded.save();
        await response.locals._MODELS.loan.populate(toBeIncluded, populateFields);

        response.locals._UTIL.setLocalsData(
            response,
            201,
            toBeIncluded.toObject(),
            'Empréstimo salvo'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let updated = await response.locals._MODELS.loan.findOneAndUpdate(
            { '_id': request.params._id },
            request.body,
            { 'new': true }
        ).populate(populateFields);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            updated.toObject(),
            'Empréstimo atualizado'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.loan.find(request.query)
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'requestedAt': 1 })
                .populate(populateFields)
                .exec(),

            response.locals._MODELS.loan.find(request.query).countDocuments().exec()
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
        let foundObject = await response.locals._MODELS.loan
            .findById(request.params._id)
            .populate(
                [
                    { 'path': 'requestedBy mediaOwner', 'select': 'name email' },
                    { 'path': 'media', 'select': 'platform' },
                    { 'path': 'game', 'select': 'name cover aggregated_rating formattedReleaseDate summary game_modes genres' }
                ]
            );

        if (!foundObject) {
            return next({ 'isDatabase': true, 'message': 'Empréstimo não encontrado', 'isNotFound': true });
        }

        response.locals._UTIL.setLocalsData(
            response,
            200,
            foundObject,
            'Empréstimo encontrado'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let removedObject = await response.locals._MODELS.loan.findByIdAndDelete(request.params._id);

        response.locals._UTIL.setLocalsData(
            response,
            200,
            removedObject,
            'Empréstimo removido'
        );

        next();
    } catch (error) {
        next(error);
    }
};

const removeFromMedia = async function (request, response, next) {
    try {
        if (request.body.loanId) {
            await response.locals._MODELS.loan.findByIdAndDelete(request.body.loanId);
        }

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
    'removeFromMedia': removeFromMedia,
    'search': search
};

