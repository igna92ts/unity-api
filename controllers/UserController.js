var mongoose = require('mongoose');
var User = require('../models/User');

module.exports.controller = function(app){

	app.get('/signup',function(req,res){
		
		res.render("index",{title:process.pid});

	});


	io.on('connection', function(socket){

		socket.on('USER_CONNECT', function(){
	    	console.log('user CONNECTED');
	    	socket.emit("USER_CONNECTED",{
	    		name:"Nacho"
	    	});
		});

		socket.on('disconnect', function(){
	    	//console.log('user disconnected');
		});
	});
}


