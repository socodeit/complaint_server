// Dependencies
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');

// user schema
var complaintSchema   = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    hostel_name: {
        type: String
    },
    complaint_id: {
        type: String,
        required: true
    },
    complaint_title: {
        type: String,
        required: true
    },
    complaint_desc: {
        type: String,
        required: true
    },
    complaint_image_link: {
        type: String
    },
    authority_name: {
        type: String,
        required: true
    },
    complaint_level: {
        type: Number,
        required: true
    },
    is_resolved: {
        type: Boolean,
        required: true
    },
    upvotes:{
        type: Number,
        required: true
    },
    downvotes:{
        type: Number,
        required: true
    }, 
    tag: [{tag_name:String}],
    comments: [{comment_name:String}]
});


// Apply the uniqueValidator plugin to userSchema. 
complaintSchema.plugin(uniqueValidator);
complaintSchema.plugin(timestamps);

var Complaint = mongoose.model('complaints',complaintSchema);

// CRUD - Create Read Update Delete

// 1. Create
module.exports.addComplaint = function(body,res){
    var complaint = new Complaint;
    
    complaint.userid = body.userid;
    complaint.name = body.name;
    complaint.complaint_title = body.complaint_title;
    complaint.complaint_desc = body.complaint_desc;
    
    if(body.complaint_image_link !=null)
    complaint.complaint_image_link = body.complaint_image_link;
    
    complaint.complaint_level = body.complaint_level;
    
    if(complaint.complaint_level <= 1)
    {
        complaint.hostel_name = body.hostel_name;
    }
    
    complaint.authority_name = body.authority_name;
    complaint.is_resolved = false;
    complaint.upvotes = 0;
    complaint.downvotes =0;
    complaint.tag = body.tag;
    
    
    complaint.save(function(err){
        // save() will run insert() command of MongoDB.
        // it will add new data in collection.
        var response;
            if(err) {
                response = {"error" : true,"message" : "Unable to add complaint"};
            } else {
                response = {"error" : false,"message" : "Complaint added"};
            }
            res.json(response);
        });
    
};

// To get all comlaints
module.exports.showAll = function(res){
    var response ={};
    Complaint.find({},function(err,data){
       if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response); 
    });
};

//To get hostel complaints
module.exports.getHostelComplaints = function(hostel,res){
    var response={};
    Complaint.find({hostel_name: hostel},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
    });   
};

//To get institute level complaints
module.exports.getInstituteComplaints = function(res){
    var response={};
    Complaint.find({complaint_level: 2},function(err, data) {
        if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
    });   
};

