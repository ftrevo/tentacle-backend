// ------------------- Funções Exportadas ------------------- //
const search = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.mediaLoan
                .find(
                    request.query,
                    'id platform active gameData._id gameData.name activeLoan._id activeLoan.requestedAt activeLoan.loanDate'
                )
                .skip(response.locals.pagination.skip)
                .limit(response.locals.pagination.max)
                .sort({ 'gameData.name': 1 })
                .exec(),

            response.locals._MODELS.mediaLoan.find(request.query).countDocuments().exec()
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
        let foundObject = await response.locals._MODELS.mediaLoan.findById(request.params._id);;

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

// --------------------- Module Exports --------------------- //
module.exports = {
    'findById': findById,
    'search': search
};

