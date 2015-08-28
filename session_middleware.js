exports.validate = function(req,res,next){
	
	if(!req.session.user_id && (req.originalUrl === "/lenguajes" || req.originalUrl === "/propiedades")){
		res.redirect("/login");
	}
	else{
		next();
	}
}