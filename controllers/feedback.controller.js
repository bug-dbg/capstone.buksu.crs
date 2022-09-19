const { Feedbacks } = require('../models/Feedback')
const { sign, verify } = require("jsonwebtoken")

const feedbackCtrl = {
    feedback: async (req, res) => {
        try {

            const { userFeedback } = req.body
            const accessToken = req.cookies['access-token']
            
            const user = verify(accessToken, process.env.JWT_SECRET)
            if (user) {
              req.user = user
            }
            const userID = req.user.id
    
            const newFeedback = new Feedbacks({
                userFeedback, 
                userID: userID
               
            })
    
            await newFeedback.save()
            res.redirect('/home')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = feedbackCtrl