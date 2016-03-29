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

//TODO:using bcrypt for storing password
module.exports.isAuthority = function(body,next){
    var response={};
    Authority.findOne({authority_id: body.authority_id},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                console.log(data == null);
                if(data==null)
                response = {"error" : true,"message" : "Authentication failed"};
                else if(data.password == body.password)
                    response = {"error" : false,"data" : data[0]};
                else
                    response = {"error" : true,"message" : "Authentication failed"};
            }
    next(response);
    }); 
};

// To get all authorities
module.exports.showAll = function(res){
    var response ={};
    Authority.find({},'authority_name',function(err,data){
       if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response); 
    });
};


//TODO can add delete functionality
