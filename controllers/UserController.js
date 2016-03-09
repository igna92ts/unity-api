var mongoose = require('mongoose');
var User = require('../models/User');

module.exports.controller = function(app){

	app.get('/signup',function(req,res){

		res.render("index",{title:"Hola"});

	});

	app.io.on('connection',function(){
		console.log("user connected");
	});

}