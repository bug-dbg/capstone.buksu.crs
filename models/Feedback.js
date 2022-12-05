const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    userFeedback: {
        type: String,
    },
    userID: {
        type: String,
    }

}, {
    timestamps: true
})

const Feedbacks = mongoose.model('Feedbacks', feedbackSchema)
module.exports = { feedbackSchema, Feedbacks }