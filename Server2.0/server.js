const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//requirea
var eventMap = require('./events.js');
var world = require('./Physics/world.js');
var config = require('./config.js');
var q = require('q');
var redisClient = require('./redisClient.js');

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
		eventMap[event](payLoad,rinfo,server);

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind({address:'localhost',port:8000,exclusive:false});


