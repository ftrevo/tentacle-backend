// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema de Empréstimo
const LoanSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    requestedAt: {
        type: Date
    },
    estimatedReturnDate: {
        type: Date
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    mediaOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mediaPlatform: {
        type: String
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    loanDate: {
        type: Date
    },
    returnDate: {
        type: Date
    }
}, { versionKey: false, timestamps: false });

LoanSchema.pre('save', async function (next) {
    let loan = this;

    loan.requestedAt = Date.now();

    next();
});

module.exports = mongoose.model('Loan', LoanSchema);
