var redis = require('redis');
var q = require('q');


module.exports = {

	registerDynamicObject: function(client,type){
		return q.Promise(function(resolve,reject){
			var hash = {
				id:0,
				type:type,
				position:{
					x:0,
					y:0
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
			var objId;
			client.incr('d_object_index',function(err,index){
				hash.id = index;
				client.hset('d_object',index,JSON.stringify(hash));
				client.hgetall('d_object',function (err, obj) {
					if(err){
						reject(err);
					}
					else{
						resolve(JSON.parse(obj[index]))
					}
				});
			});
		})
	}


}
