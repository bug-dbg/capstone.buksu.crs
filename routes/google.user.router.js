const router = require('express').Router()

const userGoogleCtrl = require('../controllers/user.google.controller')
const { checkAuthenticated } = require('../middlewares/google.auth')

// google login route
router.post('/login', userGoogleCtrl.googleLogin)

module.exports = router