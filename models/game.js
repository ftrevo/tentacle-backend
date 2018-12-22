// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema de Jogo
const GameSchema = new mongoose.Schema({
    title: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
