const { Schema, model, Types } = require('mongoose')

const filesave = new Schema({
    imageurl: { type: String },
    imageid: { type: String },
    section: { type: Types.ObjectId, ref: "Section" },
})

module.exports.FileSave = model('FileSave', filesave)