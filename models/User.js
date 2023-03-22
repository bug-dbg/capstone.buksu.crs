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
        required: true,
        default: 0
    },
    verified: {
        type: Boolean,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

const Users = mongoose.model('User', userSchema)
module.exports = { userSchema, Users }