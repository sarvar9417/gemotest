const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const doctor = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    fathername: { type: String },
    phone: { type: Number },
    born: { type: Date },
    section: { type: Types.ObjectId, ref: "HeadSection" },
    image: { type: String },
    procient: {type: Number}
}, {
    timestamps: true,
})

function validateDoctor(doctor) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6),
        firstname: Joi.string(),
        lastname: Joi.string(),
        fathername: Joi.string(),
        section: Joi.string(),
        phone: Joi.number(),
        born: Joi.date(),
        image: Joi.string(),
        procient: Joi.number()


    })
    return schema.validate(doctor)
}

function validateDoctorLogin(doctor) {
    const schema = Joi.object({
        login: Joi.string().required().lowercase().max(30),
        password: Joi.string().required().max(30).min(6)
    })
    return schema.validate(doctor)
}

module.exports.validateDoctorLogin = validateDoctorLogin
module.exports.validateDoctor = validateDoctor
module.exports.Doctor = model('Doctor', doctor)
