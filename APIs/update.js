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

//To upvote or downvote complaint
//Require : {"userid" "complaint_id"}
router.post('/vote',function(req,res){
    switch(req.body.vote)
    {
        case '1':Complaint.upvoteComplaint(req.body,res);break;
        case '-1':Complaint.downvoteComplaint(req.body,res);break;
    }
});

//To put comment
//Require : {comment, userid, complaint_id, name}
router.post('/comment',function(req, res) {
    Complaint.addComment(req.body,res);
});

//To like comment
//Require : {comment_id,complaint_id,userid}
router.post('/likecomment',function(req, res) {
    Complaint.likeComment(req.body,res);
});

//To update status
//Require : {complaint_id, status}
router.post('/resolved',function(req, res) {
   Complaint.updateStatus(req.body,res); 
});


//To update profile pic
router.post('/profilepic',function(req,res){
    Users.updateProfile(req.body,req.file,res);
});

module.exports = router;