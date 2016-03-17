var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var config = require('./config.js');
var q = require('q');

//SETEO REDIS 
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port,config.redis.host);

//CONFIG REDIS Y TRAIGO PAQUETES
var pkg_user = require('./redis_pkgs/pkg_user.js');
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
var counter = 0;

io.on('connection', function(socket){

  socket.on('disconnect',function(){
    console.log('user disconnected');
    console.log(counter);
  });

  socket.on('NEW_PLAYER',function(){
    //EL TIPO SIEMPRE EN MAYUSCULA LA PRIMERA
    var player = pkg_user.registerDynamicObject(redisClient,'Player'); //DEVUELVE UNA PROMESA DEL RESULTADO DE LA QUERY
    player.done(function(){
      io.emit("OBJECT_CREATED",player.valueOf());
    });
  });

  socket.on('USER_CONNECT',function(msg){
    io.emit("USER_CONNECTED",msg);
  });

  socket.on('STATE_UPDATE',function(msg){
    counter ++;
    
  });

});

http.listen(ports.register('sub-server'));