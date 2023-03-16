const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    numberOfUsers: {
        type: String,
    },
    coursePredictions: [{
        type: String,
    }]
})

const Reports = mongoose.model('Reports', ReportSchema)
module.exports = { ReportSchema, Reports }