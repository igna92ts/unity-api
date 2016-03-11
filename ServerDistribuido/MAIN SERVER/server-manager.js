var http = require('http');
var httpProxy = require('http-proxy');

var seaport = require('seaport');
var ports = seaport.connect('localhost',7999)


var proxy = httpProxy.createProxyServer({});

var i = 0;
http.createServer(function(req,res){

	var addresses = ports.query('sub-server');
	if (!addresses.length) {
        res.writeHead(503, {'Content-Type' : 'text/plain'});
        res.end('Service unavailable');
        return;
    }
    console.log(addresses[i].port);
	proxy.web(req,res,{
		target:addresses[i]
	});
	i = (i + 1) % addresses.length;

}).listen(8000);

