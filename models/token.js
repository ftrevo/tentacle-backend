// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');
const ms = require('ms');

//Schema Mongoose de controle de Tokens
const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    refreshToken: {
        type: String,
        trim: true
    },
    logInDate: {
        type: Date
    },
    expirationDate: {
        type: Date
    }
}, { versionKey: false, timestamps: false });

//Magic, do not touch! ;)
TokenSchema.pre('save', async function (next) {
    let token = this;

    token.logInDate = Date.now();
    token.expirationDate = new Date(token.logInDate.getTime() + ms(process.env.REFRESH_EXP_TIME));

    next();
});

//Método de validação de expiração
TokenSchema.methods.isExpired = function () {
    return Date.now() > this.expirationDate;
};

// --------------------- Module Exports --------------------- //
module.exports = mongoose.model('Token', TokenSchema);