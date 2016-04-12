
//TRAIGO PAQUETES
import {Map} from "../utils"
import {pkg_player} from '../redis_pkgs/pkg_player';
import {pkg_objects} from '../redis_pkgs/pkg_objects';

export var eventMap:Map<Function>;

eventMap["GET_UPDATES"] = function(msg:string,rinfo:any,server:any){

	var gameState = pkg_objects.getGameState();
	gameState.done(function(){
		server.send("UPDATES" +"&"+JSON.stringify(gameState.valueOf()),rinfo.port,rinfo.address);
	});
};


eventMap["NEW_PLAYER"] = function(msg:string,rinfo:any,server:any){
    var player = pkg_player.registerPlayer('Player'); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      server.send("OBJECT_CREATED" +"&"+JSON.stringify(player.valueOf()),rinfo.port,rinfo.address);
    });
};
