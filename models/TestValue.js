const mongoose = require('mongoose')

const saveTestValueSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true
    },
    currentUserID: {
        type: String,
        required: true
    },
    currentQuestionID: {
        type: String,
        required: true
    }
    
   
})

const TestValue = mongoose.model('TestValue', saveTestValueSchema)
module.exports = { saveTestValueSchema, TestValue }