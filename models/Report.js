const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    currentUserID: {
        type: String,
    },
    prediction1: {
        type: String,
    },
    prediction2: {
        type: String,
    },
    prediction3: {
        type: String,
    },
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = { ReportSchema, Reports }