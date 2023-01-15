const mongoose = require('mongoose')

const userVerificationSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    uniqueString: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const UserVerification = mongoose.model('UserVerification', userVerificationSchema)
module.exports = { userVerificationSchema, UserVerification }