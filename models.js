var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//mongoose.connect("mongodb://localhost/primera_pagina");

var productSchemaJSON = {
	title:String,
	description:String,
	imageUrl:String,
	pricing:Number
};

var productSchema = new Schema(productSchemaJSON);

productSchema.virtual("image.url").get(function(){
	if(this.imageUrl === "" || this.imageUrl === "data.png"){
		return "default.jpg";
	}

	return this.imageUrl;
});

var Product = mongoose.model("Product",productSchema);

module.exports.Product = Product;