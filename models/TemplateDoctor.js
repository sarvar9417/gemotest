const { Schema, model, Types } = require('mongoose')
const Joi = require('joi')

const templateDoctor = new Schema({
    headsection: { type: Types.ObjectId, ref: "HeadSection" },
    template: { type: String },
    section: { type: String },
})

function validateTemplateDoctor(templateDoctor) {
    const schema = Joi.object({
        headsection: Joi.string(),
        template: Joi.string(),
        section: Joi.string()
    })
    return schema.validate(templateDoctor)
}

module.exports.validateTemplateDoctor = validateTemplateDoctor
module.exports.TemplateDoctor = model('TemplateDoctor', templateDoctor)