// Dependencies
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// authority schema
var authoritySchema   = new mongoose.Schema({
    authority_id: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    },
    authority_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


// Apply the uniqueValidator plugin to userSchema. 
authoritySchema.plugin(uniqueValidator);

var Authority = mongoose.model('authorities',authoritySchema);

// CRUD - Create Read Update Delete

// 1. Create
module.exports.addAuthority = function(body,res){
    var authority = new Authority;
    
    authority.authority_id = body.authority_id;
    authority.authority_name = body.authority_name;
    authority.password = body.password;
    
    authority.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        var response;
            if(err) {
                response = {"error" : true,"message" : "Unable to add Authority"};
            } else {
                response = {"error" : false,"message" : "Authority added"};
            }
            res.json(response);
        });
    
};

// To get all authorities
module.exports.showAll = function(res){
    var response ={};
    Authority.find({},function(err,data){
       if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response); 
    });
};


//TODO can add delete functionality
