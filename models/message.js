// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

//Schema Mongoose de controle de Mensagens
const MessageSchema = new mongoose.Schema({
    action: {
        type: String,
        trim: true
    },
    detail: {
        type: String,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true
    }
}, { versionKey: false, timestamps: true });

// --------------------- Module Exports --------------------- //
module.exports = mongoose.model('Message', MessageSchema);
