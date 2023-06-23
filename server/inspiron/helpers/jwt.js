const expressJwt = require('express-jwt');

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked
  }).unless({
    path: [
        //{ url: /\/api\/v1\/therapists(.*)/, methods: ['GET', 'OPTIONS'] },
      //`${api}/users/login`,
      //`${api}/users/register`
      { url: /(.*)/ },
    ]
  });
}

function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return done(null, true); // Return the done callback to prevent further execution
  }

  done(); // Call done() only if the user is authorized
}

module.exports = authJwt;
