// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Schema Mongoose de Usuário
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State',
    },
    city: {
        type: String,
        trim: true
    }
}, { versionKey: false, timestamps: true });

//Magic, do not touch! ;)
UserSchema.pre('save', async function (next) {
    let person = this;

    if (!person.isModified('password')) {
        return next();
    }

    let salt = await bcrypt.genSalt(12);

    person.password = await bcrypt.hash(person.password, salt);

    next();
});
UserSchema.pre('findOneAndUpdate', async function (next) {
    let query = this;

    if (!query._update.password) {
        return next();
    }

    let salt = await bcrypt.genSalt(12);

    query._update.password = await bcrypt.hash(query._update.password, salt);

    next();
});

//Método de comparação de senha
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.isUpdated = function (tokenDate) {
    return this.updatedAt.toISOString() !== tokenDate;
};

// --------------------- Module Exports --------------------- //
module.exports = mongoose.model('User', UserSchema);