const router = require('express').Router()
const testCtrl = require('../controllers/test.controller')

router.get('/test-data', testCtrl.getTestData)
router.post('/user/test-choice/value', testCtrl.saveTestDataToDB)
router.post('/user/evaluate/data', testCtrl.evaluate)
router.get('/user/result', testCtrl.getTestDataResult)

module.exports = router