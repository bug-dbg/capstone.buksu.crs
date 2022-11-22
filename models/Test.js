const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    choice1: {
        type: String,
        default: "Strongly Agree",

    },
    choice2: {
        type: String,
        default: "Agree",
    },
    choice3: {
        type: String,
        default: "Neutral",
    },
    choice4: {
        type: String,
        default: "Disagree",
    }, 
    choice5: {
        type: String,
        default: "Strongly Disagree",
    },
    categories: {
        type: String,
        required: true,
    }
})

const Test = mongoose.model('Test', testSchema)
module.exports = { testSchema, Test }