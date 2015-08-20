var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		relationship = require("mongoose-relationship");


/* TODO: Change to use environment variables */
mongoose.connect("mongodb://localhost/referencexyz");

var languageSchemaJSON = {
	title:String,
	description:String,
	properties:[{type: Schema.ObjectId, ref: "Property"}]
};

var language_schema = new Schema(languageSchemaJSON);



var propertySchemaJSON = {
	title:String,
	description:String,
	language: {type: Schema.ObjectId, ref: "Language",childPath: "properties"}
};

var property_schema = new Schema(propertySchemaJSON).plugin(relationship,{relationshipPathName: "language"})

var Language = mongoose.model("Language",language_schema);
var Property = mongoose.model("Property",property_schema);

module.exports.Language = Language;
module.exports.Property = Property;

