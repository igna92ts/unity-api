var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http,{ pingTimeout: 60000,heartbeatTimeout: 10});
var config = require('./config.js');
var q = require('q');

//SETEO REDIS 
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port,config.redis.host);

//TRAIGO PAQUETES
var pkg_player = require('./redis_pkgs/pkg_player.js');
var pkg_objects = require('./redis_pkgs/pkg_objects.js');

//CONFIG REDIS
redisClient.on('error',function(err){
    console.log("Error while connecting to redis" + err);
});
redisClient.on('connect', function() {
    console.log('connected to redis');
});
redisClient.on('diconnect', function() {
    console.log('disconnected from redis');
});
//SET INDEXES
redisClient.get('d_object_index',function(err,obj){
  if(err || obj === null)
    redisClient.set('d_object_index',0);
});


//REGISTRO EL SERVICIO EN SEAPORT
var seaport = require('seaport');
ports = seaport.connect(config.seaport.port,config.seaport.host);
var currentTimestamp = 0;

io.on('connection', function(socket){

  socket.on('disconnect',function(err){
    console.log('user disconnected  ' + err);
  });
  socket.on('error', function (err) {
    if (err.description) throw err.description;
    else throw err; // Or whatever you want to do
  });

  socket.on('NEW_PLAYER',function(){

    //EL TIPO SIEMPRE EN MAYUSCULA LA PRIMERA
    var player = pkg_player.registerPlayer(redisClient,'Player',socket.id); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      io.emit("OBJECT_CREATED",player.valueOf());
    });
  });

  socket.on('STATE_UPDATE',function(msg){
      var setOperation = pkg_objects.setGameState(redisClient,msg.state,socket.id);

  });

  socket.on('GET_STATE',function(){
    var gameState = pkg_objects.getGameState(redisClient,socket.id); //estado del juego entero
    gameState.done(function(){
       socket.emit("STATE",gameState.valueOf());
    });
  });

});

http.listen(ports.register('sub-server'));