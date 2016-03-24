const dgram = require('dgram');
const server = dgram.createSocket('udp4');


server.on('error', (err) => {
	console.log('server error:' + err.stack +'}');
	server.close();
});

server.on('message',(msg,rinfo) => {
	/*console.log(JSON.parse(msg));
	server.send("Come dgram",rinfo.port,rinfo.address);*/
	msg = msg.toString();
	var event = msg.split(/_(.+)?/)[0];
	var msg = msg.split(/_(.+)?/)[1];

});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

//si exclusive esta en true no comparte handles y no se puede clusterear
server.bind({address:'localhost',port:8000,exclusive:false});