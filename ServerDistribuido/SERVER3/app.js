var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.send('<h1>Hello 8003</h1>');
});

http.listen(8003, function(){
  console.log('listening on *:8003');
});