// --------------- Import de arquivos do core --------------- //
const requestPromise = require('request-promise');

// ------------------- Funções Exportadas ------------------- //
const list = function (queryText, pagination) {

    let listString = `search "${queryText}";`
        + 'fields aggregated_rating,aggregated_rating_count,category,cover,first_release_date,id,name,summary,'
        + 'cover.height,cover.image_id,cover.width;'
        + `limit ${pagination.max}; offset ${pagination.skip};`
        + 'where category = 0 & parent_game = null & platforms = (9, 48, 12, 49, 130, 37, 137);';

    return requestPromise(getOptions(listString));
};

const detail = function (gameId) {

    let detailString = 'fields id,aggregated_rating,aggregated_rating_count,first_release_date,name,slug,summary,url,'
        + 'cover.id,cover.height,cover.image_id,cover.width,'
        + 'game_modes.id,game_modes.name,game_modes.slug,'
        + 'genres.id,genres.name,genres.slug,'
        + 'screenshots.id,screenshots.height,screenshots.image_id,screenshots.width,'
        + 'videos.id,videos.name,videos.video_id;'
        + `where id = ${gameId};`;

    return requestPromise(getOptions(detailString));
};

// --------------------- Funções Locais --------------------- //
function getOptions(bodyString) {
    return {
        method: 'GET',
        uri: `${process.env.IGDB_REQUEST_URL}/games`,
        simple: false,
        resolveWithFullResponse: true,
        headers:
        {
            'Content-Type': 'text/plain',
            'user-key': process.env.IGDB_API_KEY
        },
        body: bodyString
    };
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'detail': detail,
    'list': list
};
