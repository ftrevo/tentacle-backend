// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema de Mídia de Jogo
const MediaSchema = new mongoose.Schema({
    platform: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    active: {
        type: Boolean,
        default: true
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Media', MediaSchema);
