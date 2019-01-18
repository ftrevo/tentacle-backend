// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema de Empréstimo
const LoanSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    requestedAt: {
        type: Date,
        default: Date.now()
    },
    media: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
    },
    mediaOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    loanDate: {
        type: Date
    },
    loanDate: {
        type: Date
    }
}, { versionKey: false, timestamps: false });

module.exports = mongoose.model('Loan', LoanSchema);
