import client = require('./redisClient');
import DynamicObject = Physics.DynamicObject;
import q = require('q');


export module pkg_objects {

	export function getGameState(){
		return q.Promise(function(resolve,reject){
			var result = Array();
			client.hvals('d_object',function(err:Error,obj:any){
				if(err){
					reject(err);
				}else{
					var tmp:any;
					obj.forEach(function(o:any){
						tmp = JSON.parse(o);
						result.push(JSON.parse(o));
					});

					resolve({state:result});
				}
			});
		});
	}

	export function setGameState(state:Array<DynamicObject>){
		return q.Promise(function(resolve,reject){
			if(state == null){
				resolve({});
			}else{
				state.forEach(function(object){
					
					client.hset("d_object",object.id,JSON.stringify(object));
				});
				resolve({});
			}
			
		});
	}


}
