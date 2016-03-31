var redis = require('redis');
var q = require('q');


module.exports = {

	getGameState: function(client){
		return q.Promise(function(resolve,reject){
			var result = Array();
			client.hvals('d_object',function(err,obj){
				if(err){
					reject(err);
				}else{
					var tmp;
					obj.forEach(function(o){
						tmp = JSON.parse(o);
						result.push(JSON.parse(o));
					});

					resolve({state:result});
				}
			});
		});
	},

	setGameState: function(client,state,owner){
		return q.Promise(function(resolve,reject){
			if(state == null){
				resolve();
			}else{
				state.forEach(function(object){
					if(object.ownedBy == owner)
						client.hset("d_object",object.id,JSON.stringify(object));
				});
				resolve();
			}
			
		});
	}


}
