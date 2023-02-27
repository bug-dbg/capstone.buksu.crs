const router = require('express').Router()
const testCtrl = require('../controllers/test.controller')
const nodemailerCtrl = require('../controllers/result.nodemailer.controller')

router.get('/test-data', testCtrl.getTestData)
router.post('/user/test-choice/value', testCtrl.saveTestDataToDB)
router.get('/user/evaluate/data', testCtrl.evaluate)
// router.get('/user/result', testCtrl.getTestDataResult)
router.post('/user/result/email', nodemailerCtrl.sendEmail)

module.exports = router