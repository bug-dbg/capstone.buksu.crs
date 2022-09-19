const bcrypt = require('bcrypt')
const { createTokens } = require('../middlewares/JWT')
const { Users } = require('../models/User')

const userCtrl = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, password } = req.body

            const user = await Users.findOne({email})
            if(user){
                return res.status(400).json({msg: "The email already exists."});
            } 
            
            if(password.length < 6){
                return res.status(400).json({msg: "Password is at least 6 characters long."})
            }

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                firstName, lastName, email, encryptedPassword: passwordHash, 
            })

            // Save to database
            await newUser.save()

            res.redirect('/')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        

        
    },

    login: async (req, res) => {
        const { email, password } = req.body

        const user = await Users.findOne({email: email})

        if(!user) return res.status(400).json({ error: "User Doesn't Exist" })

        const dbPassword = user.encryptedPassword
        bcrypt.compare(password, dbPassword).then((match) => {
            if(!match) {
                res.status(400).json({error: 'Invalid Password'})
            } else {
                const accessToken = createTokens(user)
                            
                res.cookie("access-token", accessToken, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true,
                });
            }
            res.redirect('/home')
        })
        
    }, 
    getUsers: async (req, res) => {
        try {
            const users = await Users.find({
                role: 0
            })

            res.json({
                status: 'Success',
                users: users
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-encryptedPassword').catch(
                (err) => {
                    console.log('Error: ', err)
                }
            )

            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 

    getUserEmail: async (req, res) => {
        try {
            const {email} = req.body

            const userEmail = await Users.find({email})
    
          
            res.json({email: userEmail})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
       
    },
    
    logout: (req, res) => {
        res.clearCookie('access-token')
        res.clearCookie('session-token')
        res.redirect('/')
    }
}

module.exports = userCtrl