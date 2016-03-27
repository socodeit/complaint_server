var jwt = require('express-jwt');

module.exports = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID,
  getToken: function fromHeaderOrCookie(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if(req.cookies && req.cookies.id_token) {
      return req.cookies.id_token;
    }
    return null;
  }
});