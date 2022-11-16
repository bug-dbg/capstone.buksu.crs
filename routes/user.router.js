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
    res.render('register_view/register')
})

router.get('/home', validateToken, (req, res) => {
    res.render('user_view/user')
    
})

router.get('/test', /*validateToken,*/ (req, res) => {
    res.render('test_view/test')
})

router.get('/evaluation', (req, res) => {
    res.render('congrats_page/congrats')
})

router.get('/evaluation/result', (req, res) => {
    res.render('result_page/result')
})

router.get('/sample', (req, res) => {
    res.render('test_view/sample')
})

router.get('/success/email', (req, res) => {
    res.render('email_sent_page/sent')
})


module.exports  = router