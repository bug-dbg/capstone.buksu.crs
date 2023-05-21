const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    currentUserID: {
        type: String,
    },
    field: {
        type: String,
    },
    courses: {
        type: Array
    }
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = { ReportSchema, Reports }