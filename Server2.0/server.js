const dgram = require('dgram');
const server = dgram.createSocket('udp4');
var eventMap = require('./events.js');
var physicsWorld = require('./Physics/world.js');
var config = require('./config.js');
var q = require('q');

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
    redisClient.set('d_object_index',0);
});

//CONFIG SERVIDOR
server.on('error', (err) => {
	console.log('server error:' + err.stack);
	server.close();
});

server.on('message',(msg,rinfo) => {

	msg = msg.toString();
	var event = msg.split(/&(.+)?/)[0];
	var payLoad = msg.split(/&(.+)?/)[1];

	//server.send(composeDgram(eventName,payLoad),rinfo.port,rinfo.address);
	if(eventMap[event] != undefined)
		eventMap[event](payLoad,rinfo,redisClient,server);

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind({address:'localhost',port:8000,exclusive:false});

