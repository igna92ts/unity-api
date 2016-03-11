var app = require('express')();
var http = require('http').Server(app);

var seaport = require('seaport');
ports = seaport.connect('localhost',7999);

app.get('/', function(req, res){
  res.send('<h1>Hello 8001</h1>');
});

http.listen(ports.register('sub-server'));