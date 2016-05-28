import {redisHost} from "../config";
import {redisPort} from "../config";
//SETEO REDIS 
import redis = require('redis');
var redisClient = redis.createClient(redisPort,redisHost);

//CONFIG REDIS
redisClient.on('error',function(err:Error){
    console.log("Error while connecting to redis" + err.stack);
});
redisClient.on('connect', function() {
    console.log('connected to redis');
});
redisClient.on('diconnect', function() {
    console.log('disconnected from redis');
});

export = redisClient;

