var redis = require('redis');
var guid = require('guid');
var nohm = require('nohm').Nohm;

module.exports = {

	registerDynamicObject : function(nohm){
		var objGUID = guid.create();
		var hash = {
			"GUID":objGUID,
			"position":{
				"x":0,
				"y":0
			},
			"rotation":{
				"x":0.0,
				"y":0.0,
				"z":0.0,
				"w":1.0
			},
			"linearVelocity":{
				"x":0.0,
				"y":0.0,
				"z":0.0
			},
			"angularVelocity":0.0
		}

		client.hmset('d_objects',hash,redis.print);
	},

	deleteDynamicObject : function(nohm){

	}

}

