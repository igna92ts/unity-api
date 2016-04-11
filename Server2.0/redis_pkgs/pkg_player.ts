import client = require('./redisClient.ts');
import p2 = require('p2');
import * as physics from '../Physics/world';
import q = require('q');
import {Player} from "../entities/Player";
import {Vector2D} from "../Physics/physics_type";

module.exports = {

	registerPlayer: function(type:string){
		return q.Promise(function(resolve,reject){
            
			var player = new Player();
            player.type = type;
            player.position = new Vector2D(Math.floor(Math.random() * (5 - 1 + 1)) + 1,Math.floor(Math.random() * (5 - 1 + 1)) + 1);   

			client.incr('d_object_index',function(err:Error,index:number){
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
				client.hget('d_object',index,function (err:Error, obj) {
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
