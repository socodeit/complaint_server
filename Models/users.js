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
    user.name = body.name;
    user.authority = body.authority;
    user.user_image_link = "none";
    user.is_hostel = body.is_hostel;
    user.hostel_name = body.hostel_name;
    user.is_special = body.is_special;
    
    user.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        var response;
            if(err) {
                response = {"error" : true,"message" : "Unable to save user"};
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
