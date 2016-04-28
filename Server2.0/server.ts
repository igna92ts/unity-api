import dgram = require('dgram');
const server = dgram.createSocket('udp4');

//requirea
import {eventMap} from './Events/EventManager';
import {connectionConfig} from "./config";
import {protocolID} from "./config";
import q = require('q');
import redisClient = require('./Redis/Client');
import scriptManager = require('./Redis/ScriptManager');
import worldManager = require('./Physics/WorldManager');
//CONFIG SERVIDOR
server.on('error', (err:Error) => {
	console.log('server error:' + err.stack);
	server.close();
});

server.on('message',(msg:string,rinfo:Object) => {
/*    scriptManager.run('hello',[], [],function(err:Error,result:any){
        console.log(result);
    });*/
    
	var data:string[] = msg.toString().split("&");
	var recievedProtocol:string = data[0];
	var event:string = data[1];
	var payLoad:string = data[2];
	
	//server.send(composeDgram(eventName,payLoad),rinfo.port,rinfo.address);
	if(recievedProtocol == protocolID){
    	if(eventMap[event] != undefined)
    		eventMap[event](JSON.parse(payLoad),rinfo,server);
	}

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind(8000,process.env.HOST);


