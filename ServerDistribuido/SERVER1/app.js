var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var seaport = require('seaport');
ports = seaport.connect('localhost',7999);


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res){
  res.send('<h1>Hello 8001</h1>' );
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect',function(){
    console.log('user disconnected');
  });

  socket.on('USER_CONNECT',function(msg){
    console.log(msg);
    io.emit("USER_CONNECTED",msg);
  });

  socket.on('movement',function(msg){
    socket.emit('player_movement',msg);
  });


});

http.listen(ports.register('sub-server'));