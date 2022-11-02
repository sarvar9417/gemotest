const { Schema, Types, model } = require('mongoose')
const Joi = require('joi')

const tablecolumn = new Schema({
    direction: { type: Types.ObjectId, ref: "Direction" },
    col1: String,
    col2: String,
    col3: String,
    col4: String,
    col5: String,
}, {
    timestamps: true,
})

function validateTableColumn(tablecolumn) {
    const schema = Joi.object({
        direction: Joi.string(),
        col1: Joi.string(),
        col2: Joi.string(),
        col3: Joi.string(),
        col4: Joi.string(),
        col5: Joi.string(),
    })
    return schema.validate(tablecolumn)
}

module.exports.validateTableColumn = validateTableColumn
module.exports.TableColumn = model('TableColumn', tablecolumn)
