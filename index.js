//Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

//MongoDB
mongoose.connect('mongodb://localhost/cop');

//Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use('/add',require('./APIs/post'));
app.use('/get',require('./APIs/get'));
app.use('/put',require('./APIs/update'));
app.use('/login',require('./APIs/login'));
app.use('/authoritylogin',require('./APIs/authoritylogin'));
app.use('/logout',require('./APIs/logout'));
//Start Server 
app.listen('8080');