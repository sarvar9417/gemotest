const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const direction = new Schema({
    value: { type: String, required: true },
    label: { type: String },
    section: { type: String },
    headsection: { type: Types.ObjectId, ref: "HeadSection" },
    subsection: { type: String },
    shortname: { type: String },
    price: { type: Number, required: true },
    room: { type: String },
    doctorProcient: Number,
    counteragentProcient: Number,
    counterDoctor: Number,
    norma: String,
    result: String,
    additionalone: String,
    additionaltwo: String,
    table: Boolean,
    tableturn: Number
})

function validateDirection(direction) {
    const schema = Joi.object({
        value: Joi.string(),
        price: Joi.number(),
        label: Joi.string(),
        section: Joi.string(),
        headsection: Joi.string(),
        subsection: Joi.string(),
        shortname: Joi.string(),
        room: Joi.string(),
        doctorProcient: Joi.number(),
        counteragentProcient: Joi.number(),
        counterDoctor: Joi.number(),
        norma: Joi.string(),
        result: Joi.string(),
        additionalone: Joi.string(),
        additionaltwo: Joi.string(),
        table: Joi.boolean(),
        tableturn: Joi.number()

    })
    return schema.validate(direction)
}

module.exports.validateDirection = validateDirection
module.exports.Direction = model('Direction', direction)