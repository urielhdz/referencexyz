var assert = require("assert");
var mongoose = require('mongoose'),
	models = require("../models.js"),
	Property = models.Property;
var property_data = {
	title: "Hola mundo",
	description: "La description"
}
mongoose.connect("mongodb://localhost/referencexyz_test");
describe("Property",function(){
	it("should save a language",function(){
		var language = new models.Language({title: "Hola",description: "asdasd "});	
		language.save();
		property_data["language"] = language._id;
		var prop = new Property(property_data);
		prop.save();
		assert.equal(prop.language,language._id);
	});

	it("should be in language's properties",function(){
		var language = new models.Language({title: "Hola",description: "asdasd "});	
		language.save(function(){
			property_data["language"] = language._id;
			var prop = new Property(property_data);
			prop.save(function(){
				Property.find({language: language._id},function(err,doc){
					console.log(doc);		
				});
			});			
		});
	});
});