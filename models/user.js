// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const joi = require('joi');

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
    }
}, { versionKey: false, timestamps: true });

//Magic, do not touch! ;)
UserSchema.pre('save', async function (next) {
    let person = this;

    if (!person.isModified('password')) {
        return next();
    }

    let salt = await bcrypt.genSalt(10);

    person.password = await bcrypt.hash(person.password, salt);

    next();
});
UserSchema.pre('findOneAndUpdate', async function (next) {
    let query = this;

    if (!query._update.password) {
        return next();
    }

    let salt = await bcrypt.genSalt(10);

    query._update.password = await bcrypt.hash(query._update.password, salt);

    next();
});

// --------------------- Objetos Locais --------------------- //
const joiKeys = {
    '_id': joi.string().regex(/^[0-9a-fA-F]{24}$/),
    'name': joi.string().uppercase().trim(),
    'email': joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
    'phone': joi.string().trim().regex(/^\d{2} \d{8,9}$/),
    'password': joi.string().min(5).trim(),
    'createdAt': joi.date().raw(),
    'updatedAt': joi.date().raw(),
    'page': joi.number().default(0),
    'limit': joi.number().default(9999999999)
};

// ------------------- Funções Exportadas ------------------- //
const joiCreate = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': joiKeys.name.required(),
    'email': joiKeys.email.required(),
    'phone': joiKeys.phone.required(),
    'password': joiKeys.password.required()
});

const joiUpdate = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    'name': joiKeys.name.optional(),
    'email': joiKeys.email.optional(),
    'phone': joiKeys.phone.optional(),
    'password': joiKeys.password.optional()
}).or('name', 'email', 'phone', 'password');

const joiSearch = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': joiKeys._id.optional(),
    'name': joiKeys.name.optional(),
    'email': joiKeys.email.optional(),
    'phone': joiKeys.phone.optional(),
    'page': joiKeys.page,
    'limit': joiKeys.limit
});

const joiId = joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
    '_id': joiKeys._id.required(),
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'mongooseModel': mongoose.model('User', UserSchema),
    'joi': {
        'create': joiCreate,
        'id': joiId,
        'update': joiUpdate,
        'search': joiSearch
    }
};