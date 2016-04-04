var config = require('./config.js');
//SETEO REDIS 
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port,config.redis.host);

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
    redisClient.set('d_object_index',-1); // asi con el primer incr queda en 0 que hace antes de insertar pkg_player
});

module.exports = redisClient;