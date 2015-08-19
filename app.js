var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var app_password = "12345678";
var Schema = mongoose.Schema;

cloudinary.config({
	cloud_name: "codigofacilito",
	api_key: "692877912266946",
	api_secret: "v0J8Ree2n0af_zIUcpE23Rh8eD8"
});

var app = express();

app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
});

app.listen(8080);