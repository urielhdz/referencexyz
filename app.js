var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");

var models = require("./models.js");

// cloudinary.config({
// 	cloud_name: "codigofacilito",
// 	api_key: "",
// 	api_secret: ""
// });
var app = express();
app.use(express.static('public'));
app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
});

app.listen(8080);