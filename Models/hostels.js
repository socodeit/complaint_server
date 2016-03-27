// Dependencies
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// hostel schema
var hostelSchema   = new mongoose.Schema({
    hostel_name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true
    }
});


// Apply the uniqueValidator plugin to userSchema. 
hostelSchema.plugin(uniqueValidator);

var Hostel = mongoose.model('hostels',hostelSchema);

// CRUD - Create Read Update Delete

// To add hostel
module.exports.addHostel = function(body,res){
    var hostel =new Hostel;
    hostel.hostel_name = body.hostel_name;
    
    hostel.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        var response;
            if(err) {
                response = {"error" : true,"message" : "Unable to add hostel"};
            } else {
                response = {"error" : false,"message" : "Hostel added"};
            }
            res.json(response);
        });
    
};

// To get all hostel
module.exports.showAll = function(res){
    var response ={};
    Hostel.find({},function(err,data){
       if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response); 
    });
};

//To check if hostel is present or not
module.exports.isHostelPresent = function(body,res){
    var response={};
    Hostel.find({hostel_name: body.hostel_name},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data[0]!=null};
            }
            res.json(response);
    });   
};
