const { Schema, model } = require('mongoose')
const Joi = require('joi')

const labaratoriya = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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

function validateLabaratoriya(labaratoriya) {
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
    return schema.validate(labaratoriya)
}

function validateLabaratoriyaLogin(labaratoriya) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(labaratoriya)
}

module.exports.validateLabaratoriyaLogin = validateLabaratoriyaLogin
module.exports.validateLabaratoriya = validateLabaratoriya
module.exports.Labaratoriya = model('Labaratoriya', labaratoriya)
