const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ejs = require('ejs')

const { sign, verify } = require("jsonwebtoken")

const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const { TestValue } = require('../models/TestValue')

const emailSender = {
    sendEmail: async (req, res) => {

        try {

        
            // get user id 
            if (req.cookies['access-token']) {
                var accessToken = req.cookies['access-token']
            } else {
                var sessionToken = req.cookies['session-token']
            }

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
                var normalSignedEmail = req.user.email

            } else {
                const payload = ticket.getPayload();
                console.log(payload)
                var googleSignedEmail = payload['email']

            }

                

            

           
            const { id, answer } = req.body

            let arr = []


            const value = await TestValue.find({ currentQuestion: id }, 'value -_id')

            // loop through the value and push it into an array
            value.forEach(function (data) {
                arr.push(data.value)
            })

            const { data } = await axios.post("http://localhost:3000/api/courses/recommend/", arr);

            // console.log(data);

            const ratings = data.prediction[0]

            console.log(ratings)


            let courses = [
                { name: "Bachelor of Science in Biology Major in Biotechnology ", description: "BS Bio Description" },
                { name: "Bachelor of Arts in English Language", description: "BA EL Description" },
                { name: "Bachelor of Secondary Education Major in Social Studies", description: "BSE Social Studies Description" },
                { name: "Bachelor of Arts in Economics", description: "BA Economics Description" },
                { name: "Bachelor of Arts in Sociology", description: "BA Sociology Description" },

            ]

            // Map to courses Object 

            let i = 0;
            courses.forEach(function (c) {
                c.ratings = ratings[i]
                i++
            })


            // Sort the top three result of the recommendation
            const topThreeResult = courses.sort((a, b) => b.ratings - a.ratings).slice(0, 3)
            

               
    
            

         

            // responsible for sending the email
            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: 'buksu.crs@gmail.com',
                    pass: 'ngbohcjuerqlekch'
                }
            })

            ejs.renderFile('./views/result_page/emailResult.html', { prediction: topThreeResult }, function (err, data) {
                if (err) {
                    console.log(err)
                } else {
                    var mainOptions = {
                        from: 'buksu.crs@gmail.com',
                        to:  normalSignedEmail || googleSignedEmail,
                        subject: 'Buksu CRS Result',
                        html: data
                    }

                    console.log("html data ======================>", mainOptions.html);

                    mailTransporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err)
                            return res.redirect('/evaluation/result')
                        } else {
                            console.log('Message sent: ' + info.response)
                            return res.redirect('/success/email')
                        }
                    })
                }
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }



    }
}

module.exports = emailSender

