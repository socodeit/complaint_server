var express = require('express');
var router = express.Router();
var Users = require('../Models/users');



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