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
        type: mongoose.Schema.Types.Date
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    estimatedReturnDate: {
        type: mongoose.Schema.Types.Date
    },
    loanDate: {
        type: mongoose.Schema.Types.Date
    },
    requestedByName: {
        type: mongoose.Schema.Types.String
    },
    requestedByState: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    },
    requestedByCity: {
        type: mongoose.Schema.Types.String
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
        type: mongoose.Schema.Types.Number
    },
    aggregated_rating: {
        type: mongoose.Schema.Types.Number
    },
    aggregated_rating_count: {
        type: mongoose.Schema.Types.Number
    },
    name: {
        type: mongoose.Schema.Types.String
    },
    formattedReleaseDate: {
        type: mongoose.Schema.Types.String
    }
});

//Schema de Mídia/Empréstimo
const MediaLoanSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    platform: {
        type: mongoose.Schema.Types.String
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
        type: mongoose.Schema.Types.Date
    },
    activeLoan: ActiveLoanSchema,
    gameData: GameDataSchema
}, { versionKey: false, timestamps: false });

// --------------------- Module Exports --------------------- //
module.exports = {
    'viewName': viewName,
    'model': mongoose.model('MediaLoan', MediaLoanSchema, viewName)
};


