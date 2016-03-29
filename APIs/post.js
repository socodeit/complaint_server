var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var Users = require('../Models/users');
var Authoritites = require('../Models/authorities');
var Hostel = require('../Models/hostels');
var Complaint = require('../Models/complaints')

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
  res.send('Not correct url');
});

//Add User
router.post('/user',function(req,res){
  Users.addUser(req.body,res);
});

//Add Authority
router.post('/authority',function(req, res) {
    Authoritites.addAuthority(req.body,res);
})

//Add Hostel
router.post('/hostel',function(req, res) {
    Hostel.addHostel(req.body,res);
})

//Add Complaint
router.post('/complaint',function(req, res) {
    Complaint.addComplaint(req.body,res);
});


//TODO:remove this
router.get('/all', function(req, res) {
  Users.showAll(res);
});


module.exports = router;