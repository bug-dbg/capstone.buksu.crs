const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    numberOfUsers: {
        type: String,
    }
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = { ReportSchema, Reports }