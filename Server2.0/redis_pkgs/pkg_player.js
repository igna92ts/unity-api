var client = require('../redisClient.js');
var p2 = require('p2');
var physics = require('../Physics/world.js');
var q = require('q');

var Player = require('../schemas/player_schema.js');

module.exports = {

	registerPlayer: function(type){
		return q.Promise(function(resolve,reject){
			var player = new Player({
				type:type,
                position:{
                    x: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
                    y: Math.floor(Math.random() * (5 - 1 + 1)) + 1
                }
			});
            

			client.incr('d_object_index',function(err,index){
				player.id = index;
                var boxBody = new p2.Body({
                    mass:5,
                    position:[player.position.x,player.position.y]
                });
                var boxShape = new p2.Box();
                boxBody.addShape(boxShape);
                physics.world.addBody(boxBody);
                physics.map[player.id] = physics.world.bodies.length;
        
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
