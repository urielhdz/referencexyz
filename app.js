var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/referencexyz_test");
var models = require("./models.js"),
	Language = models.Language,
	Property = models.Property;

// cloudinary.config({
// 	cloud_name: "codigofacilito",
// 	api_key: "",
// 	api_secret: ""
// });
var app = express();

app.engine("ejs",ejs_layout_engine);
app.use(express.static('public'));
app.set('view engine', 'ejs');

var router = express.Router();

router.route("/languages")
		.post(function(request,response){
			var data = {
				title: request.body.nombre,
				description: request.body.descripcion
			}
			var language = Language.new(data);
			language.save(function(err){
				res.redirect("/languages/"+language._id);
			});
		})

		.get(function(request,response){
			
			Language.find({},function(err,languages){
				res.render("languages.index",{languages: languages});	
			});

		});

router.route("/languages/:id")
	.get(function(req,res){
		Language.findById(req.params.id,function(err,language){
			res.render("languages.show",{language: language});
		});
	})
	.put(function(req,res){
		Language.findById(req.params.id,function(err,language){
			language.title = req.body.nombre;
			language.description = req.body.descripcion;

			language.save(function(){
				res.redirect("/languages/"+language._id);
			});

		})
	});

app.get("languages/new",function(req,res){
	res.render("languages.new");
});

app.get("languages/:id/edit",function(req,res){
	Language.findById(req.params.id,function(err,language){
		res.render("languages.edit",{language: language});
	});	
});

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
