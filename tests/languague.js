var mongoose = require('mongoose'),
	models = require("../models.js"),
	Language = models.Language;
var db;
var lang_data = {
	title: "HTML",
	description: "HTML tiene super poderes"
}

exports.canCreateLanguage = function(test){
	test.expect(2);
	var lang = new models.Language(lang_data);	
	test.ok(lang.save(function(err){		
		test.equal(lang.title,"HTML","Saves the correct language.title");
		test.done();
	}),"Can save new languages");
	
}

exports.getAllLanguages = function(test){
	test.expect(1);
	Language.count({},function(err,language_count){
		Language.find(function(err,languages){
			// console.log(languages.length);
			test.equal(language_count,languages.length,"Muestra todos los lenguajes");
			test.done();	
		});	
	})
	
}
exports.setUp = function(callback){
	 try {
		db = mongoose.connect("mongodb://localhost/referencexyz_test");
		callback();
	}
	catch (err) {
		console.log('Setting up failed:', err.message);
	}
}
exports.tearDown = function(callback){
	try {
			console.log('Closing connection');
			//mongoose.connection.db.dropDatabase();
			db.disconnect(callback);
	}
	catch (err) {
		console.log('Tearing down failed:', err.message);
	}
};