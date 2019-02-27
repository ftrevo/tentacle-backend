// ----------------- Import de dependências ----------------- //
const ms = require('ms');

// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.media.findById(request.body.media).exec(),
            response.locals._MODELS.loan.findOne(
                { 'media': request.body.media, 'returnDate': { $exists: false } }
            ).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateDataFromLoan(resolvedPromisses, response.locals._USER._id);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        request.body.requestedBy = response.locals._USER._id;
        request.body.mediaOwner = resolvedPromisses[0].owner;
        request.body.game = resolvedPromisses[0].game;

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        let loan = await response.locals._MODELS.loan.findById(request.params._id).exec();

        if (!loan) {
            return next({ 'isBusiness': true, 'message': ['Empréstimo não encontrado'] });
        }

        if (loan.mediaOwner.toString() !== response.locals._USER._id.toString()) {
            return next({ 'isForbidden': true });
        }

        if (request.body.action === 'LEND') {
            if (loan.loanDate) {
                return next({ 'isBusiness': true, 'message': ['Empréstimo já realizado'] });
            }

            let currentDate = Date.now();

            request.body = {
                'loanDate': currentDate,
                'estimatedReturnDate': new Date(currentDate + ms(process.env.DEFAULT_LOAN_TIME))
            };
        }

        if (request.body.action === 'RETURN') {
            if (!loan.loanDate) {
                return next({ 'isBusiness': true, 'message': ['Empréstimo não realizado'] });
            }
            if (loan.returnDate) {
                return next({ 'isBusiness': true, 'message': ['Devolução já realizada'] });
            }

            request.body = { 'returnDate': Date.now() };
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        let loan = await response.locals._MODELS.loan.findById(request.params._id).exec();

        if (!loan) {
            return next({ 'isBusiness': true, 'message': ['Empréstimo não encontrado'] });
        }

        if (loan.requestedBy.toString() !== response.locals._USER._id.toString()) {
            return next({ 'isForbidden': true });
        }

        if (loan.loanDate || loan.returnDate) {
            return next({ 'isBusiness': true, 'message': ['Empréstimo já efetivado'] });
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        if (request.query && request.query.mineOnly) {
            request.query.requestedBy = response.locals._USER._id;
            response.locals._UTIL.clearObject(request.query, ['mineOnly']);
        }

        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);

        request.query.returnDate = { '$exists': false };

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};


const rememberDelivery = async function (request, response, next) {
    try {
        let loan = await response.locals._MODELS.loan.findById(request.params._id)
            .populate([
                { path: 'requestedBy', select: 'name email' },
                { path: 'game', select: 'name' },
                { path: 'media', select: 'platform' }
            ]).exec();

        if (!loan) {
            return next({ 'isBusiness': true, 'message': ['Empréstimo não encontrado'] });
        }

        if (loan.mediaOwner.toString() !== response.locals._USER._id.toString()) {
            return next({ 'isForbidden': true });
        }

        response.locals.data = loan;
        response.locals.statusCode = 200;
        response.locals.message = 'E-mail enviado com sucesso';

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

function validateDataFromLoan(resolvedPromisses, loggedUserId) {
    let validationErrors = [];

    if (!resolvedPromisses[0]) {
        validationErrors.push('Mídia não encontrada');
    } else if (resolvedPromisses[0].owner.toString() === loggedUserId.toString()) {
        validationErrors.push('Você não pode pegar emprestado sua própria mídia');
    }

    if (resolvedPromisses[1]) {
        if (resolvedPromisses[1].requestedBy.toString() === loggedUserId.toString()) {
            validationErrors.push('Empréstimo já cadastrado');
        } else {
            validationErrors.push('Mídia encontra-se emprestada no momento');
        }
    }

    return validationErrors;
};


// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'remove': remove,
    'search': search,
    'rememberDelivery': rememberDelivery
};
