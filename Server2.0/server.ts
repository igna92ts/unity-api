import dgram = require('dgram');
const server = dgram.createSocket('udp4');

//requirea
import redisClient = require('./Redis/Client');
import scriptManager = require('./Redis/ScriptManager');
import {eventMap} from './Events/EventManager';
import {protocolID} from "./config";
import q = require('q');
import worldManager = require('./Physics/WorldManager');
import {connectionManager} from "./Connections/ConnectionManager";
//CONFIG SERVIDOR
server.on('error', (err:Error) => {
	console.log('server error:' + err.stack);
	server.close();
});

server.on('message',(msg:string,rinfo:any) => {

    var data:string[] = msg.toString().split("&");
    var recievedProtocol:string = data[0];
    var deviceId:string = data[1];
    var event:string = data[2];
    var payLoad:string = data[3];
    if(connectionManager.checkConnection(deviceId,rinfo,server) == "OK"){//si la connecion esta viva o es nueva	
    	if(recievedProtocol == protocolID){
        	if(eventMap[event] !== undefined)
        		eventMap[event](payLoad!==undefined?JSON.parse(payLoad):null,rinfo,server,deviceId);
        	else
    	        sendPong(server,rinfo);
    	}
    }

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind(8000,process.env.HOST);

function sendPong(server:any,rinfo:any){
    server.send(protocolID,rinfo.port,rinfo.address);
}


