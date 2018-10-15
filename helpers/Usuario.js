// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

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

//Schemas Joi de Usuário
const JoiUsuarioCriacao = Joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: Joi.any().forbidden(),
    name: Joi.string().uppercase().trim().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).lowercase().trim().required(),
    phone: Joi.string().trim().regex(/^\d{2} \d{8,9}$/).required(),
    password: Joi.string().min(5).trim().required(),
    createdAt: Joi.any().forbidden(),
    updatedAt: Joi.any().forbidden()
});

const JoiUsuarioAtualizacao = Joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: Joi.any().forbidden(),
    name: Joi.string().uppercase().trim().optional(),
    email: Joi.string().email({ minDomainAtoms: 2 }).lowercase().trim().optional(),
    phone: Joi.string().trim().regex(/^\d{2} \d{8,9}$/).optional(),
    password: Joi.string().min(5).trim().optional(),
    createdAt: Joi.any().forbidden(),
    updatedAt: Joi.any().forbidden()
});

const JoiUsuarioConsulta = Joi.object().options({ abortEarly: false, allowUnknown: true }).keys({
    _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
    name: Joi.string().uppercase().trim().optional(),
    email: Joi.string().lowercase().trim().optional(),
    phone: Joi.string().trim().optional(),
    password: Joi.any().forbidden(),
    createdAt: Joi.date().timestamp().optional(),
    updatedAt: Joi.date().timestamp().optional(),
    page: Joi.number().optional().default(0),
    limit: Joi.number().optional().default(9999999999)
});

module.exports = {
    'MongooseUsuarioModel': mongoose.model('Usuario', UserSchema),
    'JoiUsuarioCriacao': JoiUsuarioCriacao,
    'JoiUsuarioAtualizacao': JoiUsuarioAtualizacao,
    'JoiUsuarioConsulta': JoiUsuarioConsulta
};