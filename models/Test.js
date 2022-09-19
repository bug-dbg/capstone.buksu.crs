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
        default: "Nuetral",
    },
    choice4: {
        type: String,
        default: "Disagree",
    }, 
    choice5: {
        type: String,
        default: "Strongly Disagree",
    }
})

const Test = mongoose.model('Test', testSchema)
module.exports = { testSchema, Test }