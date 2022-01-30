const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const connector = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    counteragent: String,
    source: String,
    type: String,
    position: String,
    doctor: String,
    prepaymentCashier: Number,
    diagnosis: String,
    bronDay: Date,
    probirka: Number,
    accept: Boolean
})

function validateConnector(connector) {
    const schema = Joi.object({
        client: Joi.string(),
        counteragent: Joi.string(),
        source: Joi.string(),
        type: Joi.string(),
        position: Joi.string(),
        doctor: Joi.string(),
        prepaymentCashier: Joi.number(),
        diagnosis: Joi.string(),
        bronDay: Joi.date(),
        probirka: Joi.number(),
        accept: Joi.bool()
    })
    return schema.validate(connector)
}

module.exports.validateConnector = validateConnector
module.exports.Connector = model('Connector', connector)