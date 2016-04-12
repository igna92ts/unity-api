import dgram = require('dgram');
const server = dgram.createSocket('udp4');

//requirea
import {eventMap} from './Events/EventManager';
import config = require('./config');
import q = require('q');
import redisClient = require('./Redis/Client');
import worldManager = require('./Physics/WorldManager');
//CONFIG SERVIDOR
server.on('error', (err:Error) => {
	console.log('server error:' + err.stack);
	server.close();
});

server.on('message',(msg:string,rinfo:Object) => {

	msg = msg.toString();
	var event:string = msg.split(/&(.+)?/)[0];
	var payLoad:string = msg.split(/&(.+)?/)[1];
	//server.send(composeDgram(eventName,payLoad),rinfo.port,rinfo.address);
	if(eventMap[event] != undefined)
		eventMap[event](payLoad,rinfo,server);

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind(8000,'localhost');


