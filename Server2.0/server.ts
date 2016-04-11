import dgram = require('dgram');
const server = dgram.createSocket('udp4');
declare var global:;
global.flatStringify = function (x:Object) {
    for(let i in x) {
        if(!x.hasOwnProperty(i)) {
            // weird as it might seem, this actually does the trick! - adds parent property to self
            x[i] = x[i];
        }
    }
    return JSON.stringify(x);
}

//requirea
import eventMap = require('./events.js');
import config = require('./config.js');
import q = require('q');
import redisClient = require('./redisClient');
import world_manager = require('./Physics/world_manager.js');
//CONFIG SERVIDOR
server.on('error', (err) => {
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
server.bind({address:'localhost',port:8000,exclusive:false});


