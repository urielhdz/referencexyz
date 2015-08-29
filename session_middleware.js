exports.validate = function(req,res,next){
	
	if(!req.session.user_id && (req.originalUrl === "/admin/lenguajes" || req.originalUrl === "/admin/propiedades")){
		res.redirect("/login");
	}
	else{
		next();
	}
}