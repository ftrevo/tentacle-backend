// ------------------- Funções Exportadas ------------------- //
const saveOrUpdate = async function (request, response, next) {
    try {
        let docCount = await response.locals._MODELS.token.countDocuments({ 'user': response.locals.userId }).exec();

        if (docCount !== 0) {
            await response.locals._MODELS.token.deleteMany({ 'user': response.locals.userId });
        }

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
    'saveOrUpdate': saveOrUpdate
};

