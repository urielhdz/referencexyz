var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")

var models = require("./models.js");

// cloudinary.config({
// 	cloud_name: "codigofacilito",
// 	api_key: "",
// 	api_secret: ""
// });
var app = express();

app.engine("ejs",ejs_layout_engine);
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");
});

app.get("/index",function(req,res){
	res.render("index");
});

app.listen(8080);
