const router = require('express').Router()
const reportCtrl = require('../controllers/reports.controller')


router.get('/reports', reportCtrl.numOfUsers)



module.exports = router