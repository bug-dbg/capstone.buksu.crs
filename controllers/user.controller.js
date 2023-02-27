const bcrypt = require('bcrypt')
const { createTokens } = require('../middlewares/JWT')
const { Users } = require('../models/User')
const { UserVerification } = require('../models/UserVerification')

const axios = require('axios')

const { numOfUsers } = require('./reports.controller')

// email handler
const nodemailer = require('nodemailer')

// generate unique string
const { v4: uuidv4 } = require('uuid')


// nodemailer code
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})


// testing

transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Ready for messages")
        console.log(success)
    }
})

// send verication email function
const sendVerificationEmail = ({_id, email}, res) => {
    const currentUrl = 'http://localhost:5000/'

    const uniqueString = uuidv4() + _id

    // nodemailer mail options 
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Verify you email address to complete the signup and log in into your account.</p>
        <p>This link <b>expires in 6 hours</b>.</p>
        <p>Press <a href=${currentUrl + "verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`,
    }

    // hash the uniqueString
    const saltRounds = 10
    bcrypt
        .hash(uniqueString, saltRounds)
        .then((hashUniqueString) => {
            // set value in userVerification collection
            const newVerification = new UserVerification({
                userID: _id,
                uniqueString: hashUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,

            })

            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            // email send and verification record save
                            // res.json({
                            //     status: "PENDING",
                            //     message: "Verification Email Sent! Check your email to verify!"
                            // })

                            res.redirect('/email-verification/pending')
                            
                        })
                        .catch((err) => {
                            console.log(err)
                            
                            let message = "Verification Email Failed!"
                            return res.render('register_view/register', { err: true, msg: message })
                        })
                })  
                .catch((err) => {
                    console.log(err)
                    
                    let message = "Couldn't save verification email!"
                    return res.render('register_view/register', { err: true, msg: message })
                })
        })
        .catch(() => {
            
            let message = "An error occured while hashing the email data!"
            return res.render('register_view/register', { err: true, msg: message })
        })
}


const userCtrl = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body
            const { terms } = req.body
            const user = await Users.findOne({ email })
            if (user) {
                // return res.status(400).json({msg: "The email already exists."});
                return res.render('register_view/register', { err: true, msg: 'Email already registered! Try again.' })
            }


            // if(!firstName && !lastName && !email && !password)  {
            //     return res.render('register_view/register', { err: true, msg: 'Please fill in all the fields!' })
            // }

            // check if terms and conditions is checked
            if(!terms) {
                return res.render('register_view/register', { err: true, msg: 'Please accept the terms and conditions to proceed.' })
            }


            // if(password.length < 6){
            //     return res.status(400).json({msg: "Password is at least 6 characters long."})
            // }

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                firstName, 
                lastName, 
                email, 
                encryptedPassword: passwordHash,
                verified: false
            })

            // Save to database
            await newUser
            .save()
            .then((result) => {
                // handle account verification
                sendVerificationEmail(result, res)
            })
            .catch((err) => {
                console.log(err)

                let message = "An error occured while saving the user account!"
                return res.render('register_view/register', { err: true, msg: message })
            })

            // res.redirect('/')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }



    },

    verifySignin: async (req, res) => {
        let { userID, uniqueString } = req. params

        UserVerification.find({userID})
            .then((result) => {
                if(result.length > 0) {
                    // user verification record exists so we proceed

                    const  { expiresAt } = result[0]
                    const hashUniqueString = result[0].uniqueString

                    // checking for expired unique String
                    if (expiresAt < Date.now()) {
                        // record has expired so we delete it

                        UserVerification
                            .deleteOne({userID})
                            .then((result) => {
                                Users
                                    .deleteOne({_id: userID})
                                    .then((result) => {
                                        let message = "Link has expired. Please sign up again."
                                        return res.render('verify_page/verified', { err: true, message: message })
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                        let message = "Clearing user with expired unique string failed!"
                                        return res.render('verify_page/verified', { err: true, message: message })
                                    })
                            })
                            .catch((error) => {
                                console.log(error)
                                let message = "An error occured while clearing expired record!"
                                return res.render('verify_page/verified', { err: true, message: message })
                            })
                    } else {
                        // valid record exist so we validate the user string
                        // first compare the hashed unique string

                        bcrypt
                            .compare(uniqueString, hashUniqueString)
                            .then((result) => {
                                if(result) {
                                    // string match
                                    Users
                                        .updateOne({_id: userID}, {verified: true})
                                        .then(() => {
                                            UserVerification    
                                                .deleteOne({userID})
                                                .then(() => {
                                                    // add data to reports                                
                                                    // axios.get('http://localhost:5000/api/reports')
                                                    res.redirect('/verified')
                                                })
                                                .catch((error) => {
                                                    console.log(error)
                                                    let message = "An error occured while finalizing successful verification."
                                                    return res.render('verify_page/verified', { err: true, message: message })
                                                })
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                            let message = "An error occured while updating user record to show verified!"
                                            return res.render('verify_page/verified', { err: true, message: message })
                                        })
                                } else {
                                    // existing record but incorrect
                                    let message = "Invalid verification details passed. Check your inbox."
                                    return res.render('verify_page/verified', { err: true, message: message })
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                                let message = "An error occured while comparing unique string!"
                                return res.render('verify_page/verified', { err: true, message: message })
                            })
                    }

                } else {
                    // user verification doesn't exist
                    let message = "Account record doesn't exist or has been verified already. Please sign up or log in!"
                    // res.redirect(`/verified/error=true&message=${message}`)
                    return res.render('verify_page/verified', { err: true, message: message })
                }
            })
            .catch((error) => {
                console.log(error)
                let message = "An error occured while checking for existing user verification record!"
                return res.render('verify_page/verified', { err: true, message: message })
                
            })
    },

    login: async (req, res) => {

        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email: email })

            // if(!user) return res.status(400).json({ error: "User Doesn't Exist" })
            if (!user) {
                return res.render('index', { err: true, msg: 'User doesn\'t exist' })
            }

            if(!user.verified) {
                return res.render('index', { err: true, msg: 'Email hasn\'t been verified. Check your inbox.'})
            }

            const dbPassword = user.encryptedPassword
            bcrypt.compare(password, dbPassword).then((match) => {
                if (!match) {
                    // res.status(400).json({error: 'Invalid Password'})
                    return res.render('index', { err: true, msg: 'Invalid Password' })
                } else {
                    const accessToken = createTokens(user)

                    res.cookie("access-token", accessToken, {
                        maxAge: 60 * 60 * 24 * 30 * 1000,
                        httpOnly: true,
                    });
                }
                res.redirect('/home')
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUsers: async (req, res) => {
        try {
            const users = await Users.find({
                role: 0
            })

            res.json({
                status: 'Success',
                users: users,
                length: users.length
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-encryptedPassword').catch(
                (err) => {
                    console.log('Error: ', err)
                }
            )

            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getUserEmail: async (req, res) => {
        try {
            const { email } = req.body

            const userEmail = await Users.find({ email })


            res.json({ email: userEmail })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },

    logout: (req, res) => {
        res.clearCookie('access-token')
        res.clearCookie('session-token')
        res.redirect('/')
    },
    
    adminjsLogout: (req, res) => {
        res.clearCookie('admin-access-token')
        res.redirect('/')
    }
}

module.exports = userCtrl
