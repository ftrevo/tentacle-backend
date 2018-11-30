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

// ------------------- Funções Exportadas ------------------- //
const joiCreate = joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: joi.any().forbidden(),
    name: joi.string().uppercase().trim().required(),
    email: joi.string().email({ minDomainAtoms: 2 }).lowercase().trim().required(),
    phone: joi.string().trim().regex(/^\d{2} \d{8,9}$/).required(),
    password: joi.string().min(5).trim().required(),
    createdAt: joi.any().forbidden(),
    updatedAt: joi.any().forbidden()
});

const joiUpdate = joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: joi.any().forbidden(),
    name: joi.string().uppercase().trim().optional(),
    email: joi.string().email({ minDomainAtoms: 2 }).lowercase().trim().optional(),
    phone: joi.string().trim().regex(/^\d{2} \d{8,9}$/).optional(),
    password: joi.string().min(5).trim().optional(),
    createdAt: joi.any().forbidden(),
    updatedAt: joi.any().forbidden()
});

const joiSearch = joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    name: joi.string().uppercase().trim().optional(),
    email: joi.string().lowercase().trim().optional(),
    phone: joi.string().trim().optional(),
    password: joi.any().forbidden(),
    createdAt: joi.date().timestamp().optional(),
    updatedAt: joi.date().timestamp().optional(),
    page: joi.number().optional().default(0),
    limit: joi.number().optional().default(9999999999)
});

// --------------------- Module Exports --------------------- //
module.exports = {
    'mongooseModel': mongoose.model('Usuario', UserSchema),
    'joi': {
        'create': joiCreate,
        'update': joiUpdate,
        'search': joiSearch
    }
};