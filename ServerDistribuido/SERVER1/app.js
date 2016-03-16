var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var config = require('./config.js');

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


//REGISTRO EL SERVICIO EN SEAPORT
var seaport = require('seaport');
ports = seaport.connect(config.seaport.port,config.seaport.host);
var counter = 0;

io.on('connection', function(socket){
  pkg_user.registerDynamicObject(redisClient);

  socket.on('disconnect',function(){
    console.log('user disconnected');
    console.log(counter);
  });

  socket.on('USER_CONNECT',function(msg){
    console.log(msg);
    io.emit("USER_CONNECTED",msg);
  });

  socket.on('STATE_UPDATE',function(msg){
    counter ++;
  });

});

http.listen(ports.register('sub-server'));