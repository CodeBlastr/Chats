var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)


var clients = [];
var rooms = [];

app.listen(1337);

function handler (req, res) {
  console.log("Connection");
}

io.sockets.on('connection', function (socket) {
  
  socket.emit('news', { hello: 'world' });
  socket.on('key', function (data) {
    console.log(data);
  });
});