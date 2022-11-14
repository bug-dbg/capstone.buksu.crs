const { Feedbacks } = require('../models/Feedback')
const { sign, verify } = require("jsonwebtoken")

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const feedbackCtrl = {
    feedback: async (req, res) => {
        try {

            if(req.cookies['access-token']) {
                var accessToken = req.cookies['access-token']
            } else {
                var sessionToken = req.cookies['session-token']
            }

            const { userFeedback } = req.body
          
          
            
            if (accessToken) {
                  
            var user = verify(accessToken, process.env.JWT_SECRET)

            } else {
                var ticket = await client.verifyIdToken({
                    idToken: sessionToken,
                    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                })
            }
         

          

            if (user) {
                req.user = user
                var userID = req.user.id
               
            } else {
                const payload = ticket.getPayload();
                var userid = payload['sub']
            }   
            
           
                     
            
    
            const newFeedback = new Feedbacks({
                userFeedback, 
                userID: userID || userid
               
            })
    
            await newFeedback.save()
            res.redirect('/home')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = feedbackCtrl