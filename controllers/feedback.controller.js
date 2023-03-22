const { Feedbacks } = require('../models/Feedback')
const { sign, verify } = require("jsonwebtoken")

const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const feedbackCtrl = {
    homeFeedback: async (req, res) => {
        try {

        
            var accessToken = req.cookies['access-token']
            var user = verify(accessToken, process.env.JWT_SECRET)
            const { userFeedback } = req.body


            if (user) {
                req.user = user
                var userID = req.user.id

            } else {
                console.log('Something went wrong when getting user!')
            }





            const newFeedback = new Feedbacks({
                userFeedback,
                userID: userID

            })

            await newFeedback.save()
            res.redirect('/home')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }, 

    testFeedback: async (req, res) => {
        try {

            var accessToken = req.cookies['access-token']
            var user = verify(accessToken, process.env.JWT_SECRET)
            const { userFeedback } = req.body


            if (user) {
                req.user = user
                var userID = req.user.id

            } else {
                console.log('Something went wrong when getting user ID!')
            }

            const newFeedback = new Feedbacks({
                userFeedback,
                userID: userID 

            })

            await newFeedback.save()
            res.redirect('/api/user/evaluate/data')
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = feedbackCtrl