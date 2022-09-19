const router = require('express').Router()
const testCtrl = require('../controllers/test.controller')

router.get('/test-data', testCtrl.getTestData)

module.exports = router