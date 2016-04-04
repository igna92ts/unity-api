var client = require('../redisClient.js');
var world = require('../Physics/world.js');
var q = require('q');

var Player = require('../schemas/player_schema.js');

module.exports = {

	registerPlayer: function(type){
		return q.Promise(function(resolve,reject){
			var player = new Player({
				type:type
			});

			client.incr('d_object_index',function(err,index){
				player.id = index;
                var circleBody = new p2.Body({
					mass:5,
					position:[player.position.x,player.position.y]
				});
				var circleShape = new p2.Circle({radius:1});
				circleBody.addShape(circleShape);
				world.addBody(circleBody);
				result[player.id] = world.bodies.length;
                
				client.hset('d_object',index,JSON.stringify(player));
				client.hget('d_object',index,function (err, obj) {
					if(err){
						console.log(err);
						reject(err);
					}
					else{
						resolve(JSON.parse(obj))
					}
				});
			});
		})
	}


}
