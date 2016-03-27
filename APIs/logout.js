var express = require('express');
var router = express.Router();
var Users = require('../Models/users');

router.get('/', function(req, res) {
  res.clearCookie('token')
    .json({message:"Logout successful"});
});


module.exports = router;