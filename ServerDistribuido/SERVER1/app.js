var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var config = require('./config.js');

//SETEO REDIS Y NOHM
var redis = require('redis');
var nohm = require('nohm').Nohm;
var redisClient = redis.createClient(config.redis.port,config.redis.host);
nohm.setClient(redisClient);
var redisFunc = require('./redis_functions.js');
redisClient.on('error',function(err){
    console.log("Error while connecting to redis" + err);
});
redisClient.on('connect', function() {
    console.log('connected to redis');
});
redisClient.on('diconnect', function() {
    console.log('disconnected from redis');
});
console.log(nohm);
fs.readdirSync('./hash_models').forEach(function(file){
  if(file.substr(-3) == '.js'){
    nohm = require('./hash_models/' + file)(nohm);
  }
});

//REGISTRO EL SERVICIO EN SEAPORT
var seaport = require('seaport');
ports = seaport.connect(config.seaport.port,config.seaport.host);
var counter = 0;

io.on('connection', function(socket){
  redisFunc.registerDynamicObject(nohm);

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