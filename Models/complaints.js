// Dependencies
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var autoIncrement = require('mongoose-auto-increment');

// Complaint schema
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
        default: false
    },
    upvotes:{
        count:{
            type:Number,
            default:0
        },
        userid:[String]
    },
    downvotes:{
        count:{
            type:Number,
            default:0
        },
        userid:[String]
    }, 
    tags: [String],
    comments: [{ comment_id:{type:Number,required:true} , userid:{type:String,required:true} , name:{type:String,required:true} ,comment:{type:String,required:true} ,likes:{count:{type:Number,default:0}, userid:[String]}]
});


autoIncrement.initialize(mongoose.connection);

// Apply the uniqueValidator plugin to userSchema. 
complaintSchema.plugin(uniqueValidator);
complaintSchema.plugin(timestamps);
complaintSchema.plugin(autoIncrement, {model: 'complaints', field: 'complaint_id'});

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

//To get individual complaints
module.exports.getIndividualComplaints = function(userid,res){
    var response={};
    Complaint.find({userid: userid},function(err, data) {
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

//To upvote a complaint ,Require "userid" & "complaint_id" in body
module.exports.upvoteComplaint = function(body,res){
    var response={};
    
    Complaint.findOne({complaint_id:body.complaint_id},function(err,data){
        if(err)
        {
            res.json(err);
        }
        else
        {
            //to find 
            if(data.upvotes.userid.indexOf(body.userid) == -1)
            {
                data.upvotes.count+=1;
                data.upvotes.userid.push(body.userid);
                
                data.save(function(err){
                   if(err)
                    res.json({error:true , message: "Unable to upvote complaint"});
                });
                
                res.json({error:false , message: "Complaint Upvoted Successfully"});
            }
            else{
                res.json({error:true , message: "Complaint Already Upvoted"});
            }
        }
    });
};

//To downvote a complaint, Require "userid" & "complaint_id" in body
module.exports.downvoteComplaint = function(body,res){
    
    Complaint.findOne({complaint_id:body.complaint_id},function(err,data){
        if(err)
        {
            res.json(err);
        }
        else
        {
            //to find 
            if(data.downvotes.userid.indexOf(body.userid) == -1)
            {
                data.downvotes.count+=1;
                data.downvotes.userid.push(body.userid);
                
                data.save(function(err){
                   if(err)
                    res.json({error:true , message: "Unable to downvote complaint"});
                });
                
                res.json({error:false , message: "Complaint downvoted Successfully"});
            }
            else{
                res.json({error:true , message: "Complaint Already downvoted"});
            }
        }
    });
};

//To comment on a complaint, Require "userid", "name" & "complaint_id"
module.exports.addComment = function(body,res){
  Complaint.findOne({complaint_id:body.complaint_id},function(err, data) {
      if(err)
      {
          res.json(err);
      }
      else
      {
        data.comments.push({ 
          comment_id : data.comments.length,
          userid:body.userid,
          name:body.name,
          comment:body.comment
        });
        
        data.save(function(err){
                   if(err)
                    res.json({error:true , message: "Unable to post comment"});
        });
        
        res.json({error:false , message: "Comment Posted Successfully"});
      }
      
      
  })  ;
};

//To like a comment posted on a complaint, Require comment_id, complaint_id, userid
module.exports.likeComment = function(body,res){
    Complaint.findOne({complaint_id:body.complaint_id},function(err,data){
        if(err)
        {
            res.json(err);
        }
        else
        {
            //to find 
            if(data.comments[body.comment_id].likes.userid(body.userid) == -1)
            {
                data.comments[body.comment_id].likes.count+=1;
                data.comments[body.comment_id].likes.userid.push(body.userid);
                
                data.save(function(err){
                   if(err)
                    res.json({error:true , message: "Unable to like comment"});
                });
                
                res.json({error:false , message: "Comment liked Successfully"});
            }
            else{
                res.json({error:true , message: "Comment already liked"});
            }
        }
    });
};