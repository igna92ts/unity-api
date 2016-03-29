var redis = require('redis');
var q = require('q');
var Player = require('../schemas/player_schema.js');

module.exports = {

	registerPlayer: function(client,type,owner){
		return q.Promise(function(resolve,reject){
			var player = new Player({
				type:type,
				ownedBy:owner
			});

			client.incr('d_object_index',function(err,index){
				player.id = index;
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
