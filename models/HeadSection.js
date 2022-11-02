const { Schema, model } = require('mongoose')
const Joi = require('joi')

const headsection = new Schema({
    name: { type: String },
    probirka: Boolean
}, {
    timestamps: true,
})

function validateHeadSection(headsection) {
    const schema = Joi.object({
        name: Joi.string(),
        probirka: Joi.bool()
    })

    return schema.validate(headsection)
}

module.exports.validateHeadSection = validateHeadSection
module.exports.HeadSection = model("HeadSection", headsection)


