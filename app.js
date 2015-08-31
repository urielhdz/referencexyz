var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require("cloudinary");
var method_override = require("method-override");
var ejs_layout_engine = require("ejs-mate")
var mongoose = require("mongoose");
var http = require("http");
var session = require("express-session");
var session_middleware = require("./session_middleware.js");
// cloudinary.config({
// 	cloud_name: "codigofacilito",
// 	api_key: "",
// 	api_secret: ""
// });
var app = express();

var connection_string = '127.0.0.1:27017/nodetest';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.MONGO_DB_PASSWORD){
	connection_string = "mongodb://" +
  process.env.MONGO_DB_USER + ":" +
  process.env.MONGO_DB_PASSWORD + "@" +
  process.env.MONGO_DB_HOST + ':' +
  process.env.MONGO_DB_PORT + '/' +
  process.env.MONGO_DB_DATABASE;
}
mongoose.connect("mongodb://"+connection_string);

var models = require("./models"),
		Property = models.Property,
		Language = models.Language;

app.engine("ejs",ejs_layout_engine);
app.use(express.static('public'));
app.use(session({
	secret: "asd123bhaub12hajbs",
	resave: false,
	saveUninitialized: false
}));
app.use(method_override("_method"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use("/admin/lenguajes",session_middleware.validate);
app.use("/admin/propiedades",session_middleware.validate);


app.get("lenguajes/new",function(req,res){
	res.render("languages/new");
});

app.get("/propiedades/:id/visits",function(req,res){
	Property.findById(req.params.id,function(err,property){
		res.setHeader('Content-Type', 'application/json');
		if(!property == null){
			res.send(JSON.stringify("0"));
		}
		
    
	});
});


app.get("/propiedades/new",function(req,res){
	Language.find({},function(err,languages){
		res.render("properties/form",{languages: languages,property: new Property()});	
	});			
});

app.get("/propiedades_edit/:id",function(req,res){
	Property.findById(req.params.id,function(err,propiedad){
		Language.find({},function(err,languages){
			res.render("properties/form",{property: propiedad,languages: languages});
		});					
	});	
});

app.get("/search",function(req,res){
	Property.find({title: new RegExp(req.query.keyword,"i")},function(err,docs){
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
			var cursos = [
				{title: "Diseño Web Frontend", link:"https://codigofacilito.com/premium/frontend",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/042/medium/42.png?1422556431"
				},
				{title: "CSS Básico a Avanzado", link:"https://codigofacilito.com/premium/css3",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/041/medium/41.png?1422556455"
				},
				{title: "HTML5 Avanzado", link:"https://codigofacilito.com/premium/html5",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/043/medium/43.png?1422556412"
				}
			];
			Language.find({},function(err,languages){
				res.render("languages/index",{languages: languages,cursos:cursos});	
			});

		});

router.route("/lenguajes/:id")
	.get(function(req,res){
		if(req.params.id === "new"){
			res.render("languages/new");	
		}else{
			var cursos = [
				{title: "Diseño Web Frontend", link:"https://codigofacilito.com/premium/frontend",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/042/medium/42.png?1422556431"
				},
				{title: "CSS Básico a Avanzado", link:"https://codigofacilito.com/premium/css3",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/041/medium/41.png?1422556455"
				},
				{title: "HTML5 Avanzado", link:"https://codigofacilito.com/premium/html5",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/043/medium/43.png?1422556412"
				}
			];
			Language.findOne({title: req.params.id},function(err,language){
				Property.find({language: language._id}).sort({title: 1}).find(function(err,propiedades){
					res.render("languages/show",{language: language, propiedades: propiedades,cursos:cursos});
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
		Language.remove({"_id":req.params.id},function(err){
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
				language: req.body.language,
				slug: req.body.slug,
				markdown: req.body.markdown
			}
			var property = new Property(data);
			property.save(function(err){
				res.redirect("/propiedades/"+property.slug);
			});
		})

		.get(function(req,res){
			var cursos = [
				{title: "Diseño Web Frontend", link:"https://codigofacilito.com/premium/frontend",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/042/medium/42.png?1422556431"
				},
				{title: "CSS Básico a Avanzado", link:"https://codigofacilito.com/premium/css3",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/041/medium/41.png?1422556455"
				},
				{title: "HTML5 Avanzado", link:"https://codigofacilito.com/premium/html5",
					img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/043/medium/43.png?1422556412"
				}
			];
			Language.find({},function(err,languages){
				res.render("properties/index",{languages: languages,cursos:cursos});	
			});

		});

router.route("/propiedades/:id")
	.get(function(req,res){
		var ObjectId = require('mongoose').Types.ObjectId;
		var objId = new ObjectId( (req.params.id.length < 12) ? "123456789012" : req.params.id );
		Property.findOne({"slug":req.params.id},function(err,propiedad){
			if(err || propiedad == null){console.log(err);res.send(err);}
			else{
				Language.findById(propiedad.language,function(err,language){
					propiedad.visits +=1;
					propiedad.save();
					var cursos = [
						{title: "Diseño Web Frontend", link:"https://codigofacilito.com/premium/frontend",
							img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/042/medium/42.png?1422556431"
						},
						{title: "CSS Básico a Avanzado", link:"https://codigofacilito.com/premium/css3",
							img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/041/medium/41.png?1422556455"
						},
						{title: "HTML5 Avanzado", link:"https://codigofacilito.com/premium/html5",
							img_url: "http://codigofacilito.com/system/cursos/avatars/000/000/043/medium/43.png?1422556412"
						}
					];
					res.render("properties/show",{propiedad: propiedad, language: language, cursos: cursos});	
				});				
			}
			
		});	
	})
	.put(function(req,res){
		Property.findById(req.params.id,function(err,propiedad){
			propiedad.title = req.body.nombre;
			propiedad.description = req.body.descripcion;
			propiedad.language = req.body.language;
			propiedad.markdown = req.body.markdown;
			propiedad.slug = req.body.slug;
			propiedad.save();
			res.redirect("/propiedades/"+propiedad.slug);

		})
	})
	.delete(function(req,res){
		Property.remove({"_id":req.params.id},function(err){
			if(err){ console.log(err); }
			res.redirect("/propiedades");
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
		res.render("index",{total_propiedades: total_propiedades, articles: articles});
		
	});
	
});
router.route("/login")
	.get(function(req,res){
		res.render("login");
	})
	.post(function(req,res){
		models.User.count({},function(err,user_count){	
			if(user_count == 0){
				var user = new models.User({email: req.body.email, password: req.body.password});
				user.save(function(){
					req.session.user_id = user._id;
					res.redirect("/admin/lenguajes");	
				});			
			}
			else{
				models.User.findOne({email: req.body.email, password: req.body.password},function(error,user){
					
					if(!error && user !== null && typeof user._id != "undefined"){
						req.session.user_id = user._id;
						res.redirect("/admin/lenguajes");
					}else{
						res.redirect("/login");
					}
				})		
			}
			
		});
	})
	.delete(function(req,res){
		req.session.user_id = null;
		res.redirect("/");
	});

app.get("/admin/lenguajes",function(req,res){
	Language.find({},function(err,languages){
		res.render("admin/languages",{languages: languages});	
	});
});
app.get("/admin/propiedades",function(req,res){
	Property.find({},function(err,propiedades){
		res.render("admin/properties",{propiedades: propiedades});	
	});
});

app.use("/",router);
var ipaddress = process.env.NODE_IP || "127.0.0.1";
var port = process.env.NODE_PORT || 8080;
app.listen(port,ipaddress);
