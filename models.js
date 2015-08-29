var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		relationship = require("mongoose-relationship");

var language_schema = new Schema({
	title:String,
	description:String,
	propiedades:[{type: Schema.ObjectId, ref: "Propiedad"}]
});
var Language = mongoose.model("Language",language_schema);

var property_schema = new Schema({
	title:String,
	description:String,
	visits:{type: Number,default:0},
	language: {type: Schema.ObjectId, ref: "Language",childPath: "propiedades"},
	slug:String,
	markdown:String
});

property_schema.plugin(relationship,{relationshipPathName: "language"});

property_schema.virtual("url").get(function(){
	return this.slug || this._id;
});

property_schema.virtual("desc").get(function(){
	var input = this.description;
	allowed = "";
	allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  return input.replace(commentsAndPhpTags, '')
      .replace(tags, function($0, $1) {
          return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
      });
});

var Property = mongoose.model("Propiedad",property_schema);

var user_schema = new Schema({
	email:String,
	password:String
});

var User = mongoose.model("User",user_schema);

module.exports.Language = Language;
module.exports.Property = Property;
module.exports.User = User;

