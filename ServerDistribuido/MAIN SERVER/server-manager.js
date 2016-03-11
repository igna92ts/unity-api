var http = require('http');
var httpProxy = require('http-proxy');


//Direcciones
var addresses = [
	"http://localhost:8001",
	"http://localhost:8002",
	"http://localhost:8003"
];


var proxy = httpProxy.createProxyServer({});

var i = 0;
http.createServer(function(req,res){
	proxy.web(req,res,{
		target:addresses[i]
	});
	i = (i + 1) % addresses.length;
}).listen(8000);

/*httpProxy.createServer(function(req,res,proxy){
	console.log(addresses[i]);
	proxy.proxyRequest(req,res,addresses[i]);
	
	i = (i + 1) % addresses.length;
}).listen( 8000);*/