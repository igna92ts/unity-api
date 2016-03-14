var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var seaport = require('seaport');
ports = seaport.connect('localhost',7999);

function estimatePi() {
    var n = 10000000, inside = 0, i, x, y;

    for ( i = 0; i < n; i++ ) {
        x = Math.random();
        y = Math.random();
        if ( Math.sqrt(x * x + y * y) <= 1 )
            inside++;
    }

    return 4 * inside / n;
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res){
  res.send('<h1>Hello 8001</h1>' + estimatePi());
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(ports.register('sub-server'));