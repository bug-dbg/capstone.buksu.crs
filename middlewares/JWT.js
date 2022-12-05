const { sign, verify } = require("jsonwebtoken")
// Google Auth
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '270040489280-ljn99nm3ve4m8su2t77dras268tp2fiu.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const createTokens = (user) => {
  const accessToken = sign(
    { email: user.email, id: user.id },
    process.env.JWT_SECRET
  )

  return accessToken
}

const validateToken = (req, res, next) => {
  const accessToken = req.cookies['access-token']
  const googleAccessToken = req.cookies['session-token'];

  if (!accessToken && !googleAccessToken)
    return res.render('page_not_found/not_found')

  try {

    if (accessToken) {
      const user = verify(accessToken, process.env.JWT_SECRET)
      if (user) {
        req.user = user
        return next()
      }
    } else {
      let token = req.cookies['session-token'];

      let user = {};
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
        .then(() => {
          req.user = user;
          next();
        })
    }

  } catch (err) {
    return res.status(400).json({ error: err })
  }
}

module.exports = { createTokens, validateToken }