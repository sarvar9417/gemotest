const { Schema, model } = require('mongoose')
const Joi = require("joi")

const warehouse = new Schema({
    name: String,
    type: String,
    price: Number,
    pieces: Number
}, {
    timestamps: true,
})

function validateWareHouse(warehouse) {
    const schema = Joi.object({
        name: Joi.string(),
        type: Joi.string(),
        price: Joi.number(),
        pieces: Joi.number()
    })
    return schema.validate(warehouse)
}

module.exports.WareHouse = model("WareHouse", warehouse)
module.exports.validateWareHouse = validateWareHouse
