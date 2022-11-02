const { Schema, model, Types } = require('mongoose')
const Joi = require("joi")

const tablesection = new Schema({
    sectionid: { type: Types.ObjectId, ref: "Section" },
    connectorid: { type: Types.ObjectId, ref: "HeadSection" },
    clientid: { type: Types.ObjectId, ref: "Client" },
    name: { type: String },
    norma: { type: String },
    result: { type: String },
    additionalone: { type: String },
    additionaltwo: { type: String },
    accept: Boolean,
}, {
    timestamps: true,
})

function validateTableSection(tablesection) {
    const schema = Joi.object({
        sectionid: Joi.string(),
        connectorid: Joi.string(),
        clientid: Joi.string(),
        name: Joi.string(),
        norma: Joi.string(),
        result: Joi.string(),
        additionalone: Joi.string(),
        additionaltwo: Joi.string(),
        accept: Joi.boolean()
    })
    return schema.validate(tablesection)
}

module.exports.TableSection = model("TableSection", tablesection)
module.exports.validateTableSection = validateTableSection
