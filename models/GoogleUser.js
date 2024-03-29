const mongoose = require('mongoose')

const googleUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
    verified: {
        type: Boolean,
        required: true
    }
})

const GoogleUsers = mongoose.model('GoogleUser', googleUserSchema)
module.exports = { googleUserSchema, GoogleUsers }