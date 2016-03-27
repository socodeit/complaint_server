var express = require('express');
var router = express.Router();
var Users = require('../Models/users');
var jwt = require('jsonwebtoken');
var config = require('../config')

//LOGINs
router.post('/',function(req,res){
  Users.isUser(req.body,function(response){
        if(response.error == false)
        {
          var token = jwt.sign( {userid:response.data.userid, name:response.data.name} , config.secret , {
            expiresIn: "30d"
          });
          res.cookie('token',token, { maxAge: 30*24*3600*1000, httpOnly: true })
             .json(response.data);
        }
        else
          res.json({"error":true,"message":"Authentcation falure"});
  });
});


//For checking cookie
router.get('/check',function(req, res) {
    res.send(req.cookies.token);
})

module.exports = router;