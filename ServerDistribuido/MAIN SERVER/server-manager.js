var http = require('http');
var httpProxy = require('http-proxy');
var io = require('socket.io')(http);

var seaport = require('seaport');
var ports = seaport.connect('localhost',7999)


var proxy = httpProxy.createProxyServer({ws:true});


var i = 0;
var reqCount = 0;
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

proxyServer.listen(8000);



