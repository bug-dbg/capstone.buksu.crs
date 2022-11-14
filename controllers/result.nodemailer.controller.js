const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const emailSender = {
    sendEmail: (req, res) => {
        // responsible for sending the email
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: 'buksu.crs@gmail.com',
                pass: 'ngbohcjuerqlekch'
            }
        })

        let details = {
            from: 'buksu.crs@gmail.com',
            to: 'treat811@gmail.com',
            subject: 'Buksu CRS Result',
            text: 'Test Email Textdd'
            // html: fs.readFileSync(__dirname, '/result_page/result.html', 'utf-8')
        }
        // const htmlStream =fs.readFileSync(__dirname, '/result_page/result.html')

        mailTransporter.sendMail(details, (err) => {
            if(err) {
                alert("Error: Unable to send to email!")
                console.log("Error while Sending " + "\n" + "Details: " + err)
                return res.redirect('/evaluation/result')
            } else {
                console.log("Email has been sent!")
                return res.redirect('/success/email')
            }

           
        })
    }
}

module.exports = emailSender

