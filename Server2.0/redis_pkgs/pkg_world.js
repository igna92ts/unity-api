var client = require('../redisClient.js');

var p2 = require('p2');
var world = require('../Physics/world.js');
var q = require('q');

var D_object = require('../schemas/d_object_schema.js');


module.exports = {

	initWorld: function(){
		return q.Promise(function(resolve,reject){
			var result = Array();
			client.hvals('d_object',function(err,obj){
				if(err){
					reject(err);
				}else{
					var tmp;
					obj.forEach(function(o){
						tmp = JSON.parse(o);
						var circleBody = new p2.Body({
							mass:5,
							position:[tmp.position.x,tmp.position.y]
						});
						var circleShape = new p2.Circle({radius:1});
						circleBody.addShape(circleShape);
						world.addBody(circleBody);
						result[tmp.id] = world.bodies.length; // Mapeo al id del mundo asi despues acutualizo
					});

					resolve(result);
				}
			});
		});
	},

	setWorld: function(redisObjectMap){
		return q.Promise(function(resolve,reject){
			redisObjectMap.forEach(function(world_id){
                var object = new D_object({
                   id:redisObjectMap.indexOf(world_id),
                   position:{
                       x:world.bodies[world_id].position[0],
                       y:world.bodies[world_id].position[1]
                   } 
                });
                console.log(JSON.stringify(object));
				client.hset("d_object",object.id,JSON.stringify(object));
			});

			resolve();
			
		});
	}


}
