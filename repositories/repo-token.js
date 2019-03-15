// ------------------- Funções Exportadas ------------------- //
const update = async function (request, response, next) {
    try {
        let toBeUpdatedData = { 'refreshToken': response.locals.data.refreshToken };

        if (request.body.deviceToken) {
            toBeUpdatedData.deviceToken = request.body.deviceToken;
        }

        await response.locals._MODELS.token.findOneAndUpdate(
            { 'user': response.locals.userId },
            toBeUpdatedData,
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
        toBeIncluded.deviceToken = request.body.deviceToken;

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

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'findForNotification': findForNotification
};
