const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const tabledirection = new Schema({
    directionid: { type: Types.ObjectId, ref: "Direction" },
    headsectionid: { type: Types.ObjectId, ref: "HeadSection" },
    name: { type: String },
    norma: { type: String },
    result: { type: String },
    additionalone: { type: String },
    additionaltwo: { type: String },
    accept: Boolean,
})

function validateTableDirection(tabledirection) {
    const schema = Joi.object({
        directionid: Joi.string(),
        headsectionid: Joi.string(),
        name: Joi.string(),
        norma: Joi.string(),
        result: Joi.string(),
        additionalone: Joi.string(),
        additionaltwo: Joi.string(),
        accept: Joi.boolean()
    })
    return schema.validate(tabledirection)
}

module.exports.TableDirection = model("TableDirection", tabledirection)
module.exports.validateTableDirection = validateTableDirection