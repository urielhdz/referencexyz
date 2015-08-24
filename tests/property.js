var mongoose = require('mongoose'),
	models = require("../models.js"),
	Property = models.Property;

var db;
var property_data = {
	title: "Hola mundo",
	description: "La description"
}
exports.canCreateAProperty = function(test){
	test.expect(2);
	var prop = new Property(property_data);	
	test.ok(prop.save(function(err){
		test.equal(prop.title,"Hola mundo","Saves the correct prop.title");
		test.done();
	}),"Can save new properties");	
}

exports.savesRelationshipBetweenLanguageAndProperty = function(test){
	test.expect(1);
	var language = new models.Language({title: "Hola",description: "asdasd "});	

	language.save(function(){
		property_data["language"] = language._id;
		var prop = new Property(property_data);
		console.log(prop);
		prop.save(function(){
			test.equal(prop.language,language._id,"El lenguaje es guardado adecuadamente");
			test.done();
		});

	});
}

exports.languageHasProperties = function(test){
	test.expect(1);
	var language = new models.Language({title: "Hola",description: "asdasd "});	

	language.save(function(){
		property_data["language"] = language._id;
		var prop = new Property(property_data);
		prop.save(function(){
			console.log(language.propiedades);

			test.equal(language.propiedades.length, 1);
			test.done();
		});
	});
}
exports.setUp = function(callback){
	 try {
		db = mongoose.connect("mongodb://localhost/referencexyz_test");
		callback();
	}
	catch (err) {
		console.log('Setting up failed:', err.message);
		console.log(err);
	}
	// db = mongoose.connect("mongodb://localhost/referencexyz_test");
	// callback();
}
exports.tearDown = function(callback){
	try {
			console.log('Closing connection');
			db.disconnect(callback);
	}
	catch (err) {
		console.log('Tearing down failed:', err.message);
	}
};