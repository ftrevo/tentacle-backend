// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

// -------------------- Schemas internos -------------------- //
const ImageSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    height: {
        type: Number
    },
    image_id: {
        type: String
    },
    width: {
        type: Number
    }
}, { _id: false });

const SlugSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    slug: {
        type: String
    }
}, { _id: false });

const VideoSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    video_id: {
        type: String
    }
}, { _id: false });

const GameSchemaKeys = {
    id: {
        type: Number
    },
    aggregated_rating: {
        type: Number
    },
    aggregated_rating_count: {
        type: Number
    },
    cover: ImageSchema,
    first_release_date: {
        type: Date
    },
    game_modes: [SlugSchema],
    genres: [SlugSchema],
    name: {
        type: String
    },
    screenshots: [ImageSchema],
    slug: {
        type: String
    },
    summary: {
        type: String
    },
    url: {
        type: String
    },
    videos: [VideoSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    formattedReleaseDate: {
        type: String
    },
};

//Schema de Jogo
const GameSchema = new mongoose.Schema(GameSchemaKeys, { versionKey: false, timestamps: true });

module.exports = {
    'GameModel': mongoose.model('Game', GameSchema),
    'GameSchemaKeys': GameSchemaKeys
};

