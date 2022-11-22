const router = require('express').Router()
const userCtrl = require('../controllers/user.controller')
const feedbackCtrl = require('../controllers/feedback.controller')


// Auth middleware
const { validateToken } = require('../middlewares/JWT')




// custom routes
router.post('/login', userCtrl.login)
router.post('/register', userCtrl.register)
router.get('/profile', userCtrl.getUserById)
router.get('/all-users', userCtrl.getUsers)
router.get('/logout', userCtrl.logout)

router.get('/user-email', userCtrl.getUserEmail)

router.post('/feedback', feedbackCtrl.feedback)



router.get('/', (req, res) => {
    res.render('index', {err: false, msg: ''})
})


router.get('/register', (req, res) => {
    res.render('register_view/register', {err: false, msg: ''})
})

router.get('/home', validateToken, (req, res) => {
    res.render('user_view/user')
    
})

router.get('/test', validateToken, (req, res) => {
    res.render('test_view/test')
})

router.get('/evaluation', validateToken, (req, res) => {
    res.render('congrats_page/congrats')
})

router.get('/evaluation/result', validateToken, (req, res) => {
    res.render('result_page/result')
})

router.get('/success/email', validateToken, (req, res) => {
    res.render('email_sent_page/sent')
})

router.get('/instructions', validateToken, (req, res) => {
    res.render('instructions_page/instruction')
})


module.exports  = router