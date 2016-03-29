
//TRAIGO PAQUETES
var pkg_player = require('./redis_pkgs/pkg_player.js');
var pkg_objects = require('./redis_pkgs/pkg_objects.js');

var eventMap = new Array();

eventMap["JSON"] = function(msg,rinfo,redisClient){
	
};


eventMap["NEW_PLAYER"] = function(msg,rinfo,redisClient,server){
	//EL TIPO SIEMPRE EN MAYUSCULA LA PRIMERA
    var player = pkg_player.registerPlayer(redisClient,'Player',rinfo.port); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      server.send("OBJECT_CREATED" +"&"+JSON.stringify(player.valueOf()),rinfo.port,rinfo.address);
    });
};

module.exports = eventMap;