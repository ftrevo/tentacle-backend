// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

// ------------------- Objetos Exportadas ------------------- //
const viewName = 'mediaLoan';

//Schemas Filhos
const ActiveLoanSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan'
    },
    requestedAt: {
        type: Date
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estimatedReturnDate: {
        type: Date
    },
    loanDate: {
        type: Date
    },
    requestedByName: {
        type: String
    },
    requestedByState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    requestedByCity: {
        type: String
    }
});

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

const GameDataSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    cover: ImageSchema,
    id: {
        type: Number
    },
    aggregated_rating: {
        type: Number
    },
    aggregated_rating_count: {
        type: Number
    },
    name: {
        type: String
    },
    formattedReleaseDate: {
        type: String
    }
});

//Schema de Mídia/Empréstimo
const MediaLoanSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    platform: {
        type: String
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date
    },
    activeLoan: ActiveLoanSchema,
    gameData: GameDataSchema
}, { versionKey: false, timestamps: false });

// --------------------- Module Exports --------------------- //
module.exports = {
    'viewName': viewName,
    'model': mongoose.model('MediaLoan', MediaLoanSchema, viewName)
};


