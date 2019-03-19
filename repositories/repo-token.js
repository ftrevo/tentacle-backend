// ------------------- Funções Exportadas ------------------- //
const update = async function (request, response, next) {
    try {
        await response.locals._MODELS.token.findOneAndUpdate(
            { 'user': response.locals.userId },
            { 'refreshToken': response.locals.data.refreshToken },
            { 'new': true }
        ).exec();

        next();
    } catch (error) {
        next(error);
    }
};

const save = async function (request, response, next) {
    try {
        let toBeIncluded = new response.locals._MODELS.token();
        toBeIncluded.user = response.locals.userId;
        toBeIncluded.refreshToken = response.locals.data.refreshToken;

        await toBeIncluded.save();

        next();
    } catch (error) {
        next(error);
    }
};

const findForNotification = async function (request, response, next) {
    try {
        if (response.locals.notificationTo) {
            response.locals.notificationTo.token =
                await response.locals._MODELS.token.findOne(
                    { 'user': response.locals.notificationTo._id },
                    { 'deviceToken': 1 }
                ).exec();
        }

        next();
    } catch (error) {
        next(error);
    }
};

const updateDeviceToken = async function (request, response, next) {
    try {
        await response.locals._MODELS.token.updateOne(
            request.body,
            { $unset: { 'deviceToken': '' } }
        ).exec();

        await response.locals._MODELS.token.updateOne(
            { 'user': response.locals._USER._id },
            request.body
        ).exec();

        response.locals._UTIL.setLocalsData(
            response,
            200,
            undefined,
            'Token atualizado'
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
    'updateDeviceToken': updateDeviceToken,
    'findForNotification': findForNotification
};
