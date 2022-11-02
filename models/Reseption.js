const {Schema, model} = require('mongoose')
const Joi = require('joi')

const reseption = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    phone: { type: Number },
    born: { type: Date },
    section: { type: String },
    image: { type: String }
}, {
    timestamps: true,
})

function validateReseption(reseption) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6),
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        phone: Joi.number(),
        born: Joi.date(),
        image: Joi.string()
    })
    return schema.validate(reseption)
}

function validateReseptionLogin(reseption) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(reseption)
}

module.exports.validateReseption = validateReseption
module.exports.validateReseptionLogin = validateReseptionLogin
module.exports.Reseption = model('Reseption', reseption)
