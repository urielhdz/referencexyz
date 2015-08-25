var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")
var mongoose = require("mongoose");
var http = require("http");
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
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("lenguajes/new",function(req,res){
	res.render("languages/new");
});
app.get("/login",function(req,res){
	res.render("login");
});
app.get("/propiedades/:id/visits",function(req,res){
	Property.findById(req.params.id,function(err,property){
		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(property.visits));
	});
});
app.post("/login",function(){
	//TO DO
});
app.get("/propiedades/new",function(req,res){
	Language.find({},function(err,languages){
		
		res.render("properties/new",{languages: languages});	
	});			
});

app.get("/search",function(req,res){
	console.log("\n\n\n\n"+req.query.keyword+"\n\n\n\n");
	Language.find({title: new RegExp(req.query.keyword,"i")},function(err,docs){
		if(err){console.log(err);}
		res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(docs));
	});
});


var router = express.Router();

/* Lenguajes REST */

router.route("/lenguajes")
		.post(function(req,res){
			var data = {
				title: req.body.nombre,
				description: req.body.descripcion
			}
			var language = new Language(data);
			language.save(function(err){
				res.redirect("/languages/"+language._id);
			});
		})

		.get(function(req,res){
			Language.find({},function(err,languages){
				res.render("languages/index",{languages: languages});	
			});

		});

router.route("/lenguajes/:id")
	.get(function(req,res){
		if(req.params.id === "new"){
			res.render("languages/new");	
		}else{

			Language.findById(req.params.id,function(err,language){
				Property.find({language: language._id},function(err,propiedades){
					console.log("\n\n\n\n"+propiedades+"\n\n\n\n");
					res.render("languages/show",{language: language, propiedades: propiedades});
				});
			});
		}
	})
	.put(function(req,res){
		Language.findById(req.params.id,function(err,language){
			language.title = req.body.nombre;
			language.description = req.body.descripcion;

			language.save(function(){
				res.redirect("/languages/"+language._id);
			});

		})
	})
	.delete(function(req,res){
		Property.remove({"_id":req.params.id},function(err){
			if(err){ console.log(err); }
			res.redirect("/lenguajes");
		});
	});

app.get("lenguajes/:id/edit",function(req,res){
	Language.findById(req.params.id,function(err,language){
		res.render("languages/edit",{language: language});
	});	
});

/* Propiedades REST */
router.route("/propiedades")
		.post(function(req,res){
			var data = {
				title: req.body.nombre,
				description: req.body.descripcion,
				lenguaje: req.body.lenguaje_id
			}
			var property = new Property(data);
			property.save(function(err){
				res.redirect("/propiedades/"+property._id);
			});
		})

		.get(function(req,res){
			Property.find({},function(err,propiedades){
				res.render("properties/index",{propiedades: propiedades});	
			});

		});

router.route("/propiedades/:id")
	.get(function(req,res){
		if(req.params.id == "new" || typeof req.params.id == "undefined"){
			Language.find({},function(err,languages){
				res.render("properties/new",{languages: languages});	
			});			
		}else{
			Property.findById(req.params.id,function(err,propiedad){
				if(err){console.log(err);}
				Language.findById(propiedad.language,function(err,language){
					propiedad.visits +=1;
					propiedad.save();
					res.render("properties/show",{propiedad: propiedad, language: language});	
				});			
			});	
		}
	})
	.put(function(req,res){
		Property.findById(req.params.id,function(err,propiedad){
			propiedad.title = req.body.nombre;
			propiedad.description = req.body.descripcion;

			propiedad.save(function(){
				res.redirect("/propiedades/"+propiedad._id);
			});

		})
	});

app.get("propiedades/:id/edit",function(req,res){
	Property.findById(req.params.id,function(err,propiedad){
		res.render("propiedades/edit",{propiedad: propiedad});
	});	
});

app.get("/",function(req,res){
	Property.count({},function(err,total_propiedades){
		if(err){console.log(err);}
		var articles = [
			{	
				title: "Qué es HTML",
				url:"https://codigofacilito.com/articulos/43",
				image:"http://codigofacilito.com/photo_articulos_store/43.jpg"
			},
			{	
				title: "Selectores CSS",
				url:"https://codigofacilito.com/articulos/42",
				image:"http://codigofacilito.com/photo_articulos_store/42.jpg"
			},
			{	
				title: "Commits - Administrar tu repositorio",
				url:"https://codigofacilito.com/articulos/41",
				image:"http://codigofacilito.com/photo_articulos_store/41.jpg"
			},
			{	
				title: "Cómo crear una cuenta y un repositorio en Github",
				url:"https://codigofacilito.com/articulos/39",
				image:"http://codigofacilito.com/photo_articulos_store/39.jpg"
			},
			{	
				title: "Qué es Git",
				url:"https://codigofacilito.com/articulos/39",
				image:"http://codigofacilito.com/photo_articulos_store/38.jpg"
			},
			{	
				title: "Media Queries",
				url:"https://codigofacilito.com/articulos/37",
				image:"http://codigofacilito.com/photo_articulos_store/37.jpg"
			}

		];
		res.render("index",{total_propiedades: total_propiedades});
		
	});
	
});

app.use("/",router);
app.listen(8080);
