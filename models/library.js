// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');
const Game = require('./game');

// ------------------- Objetos Exportadas ------------------- //
const viewName = 'library';

//Schemas Filhos
const LibraryMediaSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerName: {
        type: String
    },
    ownerState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    ownerCity: {
        type: String
    }
});

const LibraryKeys = Object.assign(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        createdAt: {
            type: Date
        },
        mediaPs3: [LibraryMediaSchema],
        mediaPs4: [LibraryMediaSchema],
        mediaXbox360: [LibraryMediaSchema],
        mediaXboxOne: [LibraryMediaSchema],
        mediaNintendoSwitch: [LibraryMediaSchema],
        mediaNintendo3ds: [LibraryMediaSchema]
    },
    Game.schemaKeys);

const LibrarySchema = new mongoose.Schema(LibraryKeys);

// --------------------- Module Exports --------------------- //
module.exports = {
    'viewName': viewName,
    'model': mongoose.model('Library', LibrarySchema, viewName)
};
