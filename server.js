// check if were running in the production env or not
// we need to not load this production env 
// unless were in our development env
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    // load of dotenv dependencies
}

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')
const { default: AdminJS } = require('adminjs')
const options = require('./controllers/admin.controller')
const buildAdminRouter = require('./routes/adminjs.router')


const app = express()

// AdminJs 
const admin = new AdminJS(options)
const router = buildAdminRouter(admin)
app.use(admin.options.rootPath, router)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(express.urlencoded({ extended: true }))

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// Routes
app.use('/', require('./routes/user.router'))
app.use('/api', require('./routes/test.router'))
app.use('/api', require('./routes/reports.router'))
app.use('/google', require('./routes/google.user.router'))
app.all('*', (req, res) => {
    res.render('page_not_found/not_found')
})




// Connect to mongodb
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongodb'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is listening in PORT ${PORT}`)
})