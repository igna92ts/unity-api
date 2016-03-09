var mongoose = require('mongoose');
var User = require('../models/User');

module.exports.controller = function(app){

	app.get('/signup',function(req,res){
		
		var user = new User({
			user_name: req.query.user_name,
			password: req.query.password
		});
		user.save(function(err){
			if(err){
				res.send(err.code);
			}else{
				res.send("Creado Correctamente");
			}
		});
	});

}