// Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const googleUserCtrl = {
    googleLogin: (req, res) => {
        let token = req.body.token
        const verify = async () => {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            })
            const payload = ticket.getPayload();
            console.log(payload)
            const userid = payload['sub']
        }
        verify()
            .then(() => {
                res.cookie('session-token', token, {
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                    httpOnly: true,
                });
                res.send('success')
            })
            .catch(console.error)
    }
}

module.exports = googleUserCtrl