var http = require('http');

http.createServer(function (req, res) {
  
});


var io = require('socket.io').listen(1337);

var clients = [];
var rooms = [];
var xmlHttp = null;

io.set('authorization', function (handshakeData, cb) {
    //Get the origin of the request fromt the headers
  	var origin = handshakeData.headers.origin;
    var key = handshakeData.query.key;
    var room = handshakeData.query.room;
    console.log('request from origin '+origin+' : key:'+key);
    
    console.log('request sent to: '+origin+'/chats/chats/check_key/'+key)
    http.get(origin+'/chats/chats/check_key/'+key, function(res) {
  		if(res.statusCode == 200) {
  			//need to check the room, if it exists add the connection to the room
  			//else see if they can create a room if not deny access
  			if(room in io.sockets.manager.rooms) {
  				handshakeData.room = room;
  				cb(null, true);
  			}else {
  				console.log('check room: ' + origin+'/chats/chats/create_room/'+key);
  				http.get(origin+'/chats/chats/create_room/'+key, function(roomres) {
  					if(roomres.statusCode == 200) {
  						handshakeData.room = room;
  						cb(null, true);
  					}else {
  						cb(null, false);
  					}
  				})
  			}
  			handshakeData.name = handshakeData.query.name
  		}else {
  			cb(null, false);
  		}
	}).on('error', function(e) {
  		console.log("Got error: " + e.message);
  		cb(null, false);
	});
});

io.sockets.on('connection', function (socket) {
  socket.join(socket.handshake.room);
  socket.emit('hello', { message: 'Hello '+socket.handshake.name+', Welcome to '+socket.handshake.room });
  
  socket.on('message', function (message) {
  	  console.log(message);
      io.sockets.in(socket.handshake.room).emit('message', message);
  });
  
});