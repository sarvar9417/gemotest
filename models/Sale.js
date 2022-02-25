const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const sale = new Schema({
    client: { type: Types.ObjectId, ref: "Clients" },
    connector: { type: Types.ObjectId, ref: "Connector" },
    procient: { type: Number, required: true },
    summa: { type: Number, required: true },
    day: { type: Date },
    comment: { type: String }
})

function validateSale(sale) {
    const Schema = Joi.object({
        client: Joi.string(),
        connector: Joi.string(),
        procient: Joi.number(),
        summa: Joi.number(),
        day: Joi.date(),
        comment: Joi.string()
    })
    return Schema.validate(sale)
}

module.exports.validateSale = validateSale
module.exports.Sale = model('Sale', sale)