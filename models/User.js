const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
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
    encryptedPassword: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }
})

const Users = mongoose.model('User', userSchema)
module.exports = { userSchema, Users }