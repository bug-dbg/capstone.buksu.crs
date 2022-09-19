require("dotenv").config()
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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json())



app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))
app.use(express.urlencoded({extended: true }))


// Routes
app.use('/', require('./routes/user.router'))
app.use('/api', require('./routes/test.router'))
app.use('/google', require('./routes/google.user.router'))




// Connect to mongodb
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongodb'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})