
//TRAIGO PAQUETES
import {PkgPlayer} from '../Redis/PkgPlayer';
import {PkgObjects} from '../Redis/PkgObjects';

export var eventMap:utils.Map<Function> = {};

eventMap["GET_UPDATES"] = function(msg:string,rinfo:any,server:any){

	var gameState = PkgObjects.getGameState();
	gameState.done(function(){
		server.send("UPDATES" +"&"+JSON.stringify(gameState.valueOf()),rinfo.port,rinfo.address);
	});
};


eventMap["NEW_PLAYER"] = function(msg:string,rinfo:any,server:any){
    var player = PkgPlayer.registerPlayer('Player'); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      server.send("OBJECT_CREATED" +"&"+JSON.stringify(player.valueOf()),rinfo.port,rinfo.address);
    });
};


