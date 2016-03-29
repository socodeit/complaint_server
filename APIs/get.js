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

//View Complaint based on complaint-level
//Require hostel_name,userid,compplaint_level
router.post('/complaint',function(req,res){
    switch(req.body.complaint_level)
    {
        case '0':Complaint.getIndividualComplaints(req.body.userid,res);break;
        case '1':Complaint.getHostelComplaints(req.body.hostel_name,res);break;
        case '2':Complaint.getInstituteComplaints(res);break;
    }
    
});

//To get image
router.get('/uploads/:id',function(req, res) {
  res.download( __dirname + "/uploads/" + req.params.id +".png");
});

router.get('/authorities',function(req, res) {
    Authoritites.showAll(res);
})

router.get('/hostels',function(req, res) {
    Hostel.showAll(res);
})


module.exports = router;