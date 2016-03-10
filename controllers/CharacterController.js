var express = require('express');
var Character = require('../models/Character');

module.exports.controller = function(app){

	app.get('/socket',function(req,res){
		res.render('index',{title:'Character'});
	});


	app.io.on( "connection", function( socket )
	{
	    
	});

}