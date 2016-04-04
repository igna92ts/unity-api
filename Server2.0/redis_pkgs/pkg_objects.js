var client = require('../redisClient.js');
var q = require('q');


module.exports = {

	getGameState: function(){
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

	setGameState: function(state){
		return q.Promise(function(resolve,reject){
			if(state == null){
				resolve();
			}else{
				state.forEach(function(object){
					
					client.hset("d_object",object.id,JSON.stringify(object));
				});
				resolve();
			}
			
		});
	}


}
