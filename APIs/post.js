var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var Users = require('../Models/users');

//authentication using jwt
router.use(function(req,res,next){
    var token = req.body.token || req.cookies.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token,config.secret , function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'User not logged in.' 
    });
    
  }
});



router.get('/', function(req, res) {
  res.send('Try again');
});

router.post('/add',function(req,res){
  Users.addUser(req.body,res);
});

router.post('/get',function(req, res) {
    Users.getUserDetail(req.body,res);
});

router.get('/all', function(req, res) {
  Users.showAll(res);
});


module.exports = router;