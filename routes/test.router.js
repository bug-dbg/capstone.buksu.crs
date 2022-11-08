const router = require('express').Router()
const testCtrl = require('../controllers/test.controller')

router.get('/test-data', testCtrl.getTestData)
router.post('/user/test-choice/value', testCtrl.sendTestData)
router.get('/user/result', testCtrl.getTestDataResult)

module.exports = router