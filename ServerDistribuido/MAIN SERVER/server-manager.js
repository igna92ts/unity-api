var http = require('http');
var httpProxy = require('http-proxy');

var seaport = require('seaport');
var ports = seaport.connect('localhost',7999)


var proxy = httpProxy.createProxyServer({});


var i = 0;
var reqCount = 0;
http.createServer(function(req,res){

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
	console.log(reqCount++);
}).listen(8000);





