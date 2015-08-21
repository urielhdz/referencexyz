var mongoose = require('mongoose');
var models = require("../models.js");

exports.canCreateLanguage = function(test){
	test.expect(2);
	
	var data = {
		title: "HTML",
		description: "HTML tiene super poderes"
	}

	var lang = new models.Language(data);
	
	test.ok(lang.save(function(err){		
		test.equal(lang.title,"HTML","Saves the correct language.title");
		test.done();
	}),"Can save new languages");
	
}

exports.tearDown = function(done){
    mongoose.disconnect(done);
};