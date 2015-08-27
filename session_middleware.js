exports.validate = function(req,res,next){
	console.log(req.session);
	if(!req.session.user_id){
		res.redirect("/login");
	}
	else{
		next();
	}
}