
//TRAIGO PAQUETES
var pkg_player = require('./redis_pkgs/pkg_player.js');
var pkg_objects = require('./redis_pkgs/pkg_objects.js');

var eventMap = new Array();

eventMap["GET_UPDATES"] = function(msg,rinfo,server){

	var gameState = pkg_objects.getGameState();
	gameState.done(function(){
		server.send("UPDATES" +"&"+JSON.stringify(gameState.valueOf()),rinfo.port,rinfo.address);
	});
};


eventMap["NEW_PLAYER"] = function(msg,rinfo,server){
    var player = pkg_player.registerPlayer('Player'); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      server.send("OBJECT_CREATED" +"&"+JSON.stringify(player.valueOf()),rinfo.port,rinfo.address);
    });
};

module.exports = eventMap;