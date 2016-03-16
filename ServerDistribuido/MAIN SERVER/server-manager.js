var http = require('http');
var httpProxy = require('http-proxy');
var io = require('socket.io')(http);
var config = require('./config.js');

var seaport = require('seaport');
var ports = seaport.connect(config.seaport.port,config.seaport.host);


var proxy = httpProxy.createProxyServer({ws:true});


var i = 0;
var reqCount = 0;
//PROXY HTTP
var proxyServer = http.createServer(function(req,res){

	var addresses = ports.query('sub-server');
	if (!addresses.length) {
        res.writeHead(503, {'Content-Type' : 'text/plain'});
        res.end('Service unavailable');
        return;
    }

	proxy.web(req,res,{
		target:addresses[i]
	});
	i = (i + 1) % addresses.length;
});

//PROXY WS -- TCP
proxyServer.on('upgrade', function (req, socket, head) {
  	var addresses = ports.query('sub-server');
	if (!addresses.length) {
        console.log("no hay servidores");
        return;
    }

	proxy.ws(req,socket,head,{
		target:addresses[i]
	});
	i = (i + 1) % addresses.length;
});

proxyServer.listen(config.load_balancer.port);



