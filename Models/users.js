// Dependencies
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// user schema
var userSchema   = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    authority: {
        type: String,
        required: true
    },
    user_image_link: {
        type: String
    },
    is_hostel: {
        type: Boolean,
        required: true
    },
    hotel_name: {
        type: String
    },
    is_special: {
        type: Boolean,
        required: true
    }
});


// Apply the uniqueValidator plugin to userSchema. 
userSchema.plugin(uniqueValidator);

var User = mongoose.model('users',userSchema);

// CRUD - Create Read Update Delete

// 1. Create

module.exports.addUser = function(body,res){
    var user = new User;
    user.userid = body.userid;
    //TODO:To be encrypted
    user.password = body.password;
    user.name = "Vinay";
    user.type = "none";
    user.user_image_link = "none";
    user.is_hostel = false;
    user.hostel_name = "";
    user.is_special = false;
    
    user.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        var response;
            if(err) {
                response = {"error" : true,"message" : "Unable to add user"};
            } else {
                response = {"error" : false,"message" : "User added"};
            }
            res.json(response);
        });
    
};

// To get all user

module.exports.showAll = function(res){
    var response ={};
    User.find({},function(err,data){
       if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response); 
    });
};

//To get particular user details

module.exports.getUserDetail = function(body,res){
    var response={};
    User.find({userid: body.userid},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data[0]};
            }
            res.json(response);
    });   
};

//TODO:using bcrypt for storing password
module.exports.isUser = function(body,next){
    var response={};
    User.find({userid: body.userid},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                if(data[0].password == body.password)
                    response = {"error" : false,"data" : data[0]};
                else
                    response = {"error" : true,"message" : "Authentication failed"};
            }
    next(response);
    }); 
}
