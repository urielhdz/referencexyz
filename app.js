var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")

//var models = require("./models.js");

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
	res.render("index");
});

app.get("/index",function(req,res){
	var articulos = [{title: "Hola ke ase", description: "Este articulo esta interesante", url: "codigofacilito.com"},{title: "Hola mundo", description: "Este articulo esta interesante", url: "codigofacilito.com"}];
	for (var i = articulos.length - 1; i >= 0; i--) {
		console.log(articulos[i].title);
	};

	humano.years

	res.render("index",{ articulos: articulos });
});

app.listen(8080);
