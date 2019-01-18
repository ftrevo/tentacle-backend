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

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update
};
