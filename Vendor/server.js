var http = require('http');

http.createServer(function (req, res) {
  
});


var io = require('socket.io').listen(1337);

var xmlHttp = null;
var clients = [];
var offers = [];

io.set('authorization', function (handshakeData, cb) {
    //Get the origin of the request fromt the headers
  	var origin = handshakeData.headers.origin;
  	handshakeData.origin = origin;
    var key = handshakeData.query.key;
    handshakeData.key = key;
    var room = handshakeData.query.room;
    var role = handshakeData.query.role;
    console.log('request from origin '+origin+' : key:'+key);
    
    console.log('request sent to: '+origin+'/chats/chats/check_key/'+key+'.json')
    http.get(origin+'/chats/chats/check_key/'+key+'.json', function(res) {
  		if(res.statusCode == 200) {
  			if(role == 'presenter') {
  				handshakeData.role = 'presenter';
  			}
  			else {
  				handshakeData.role = 'watcher';
  			}
  			//need to check the room, if it exists add the connection to the room
  			//else see if they can create a room if not deny access
  			if(room in io.sockets.manager.rooms) {
  				handshakeData.room = room;
  				cb(null, true);
  			}else {
  				console.log('check room: ' + origin+'/chats/chats/create_room/'+key+'.json');
  				http.get(origin+'/chats/chats/create_room/'+key+'.json', function(roomres) {
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
	
  var client = { id: socket.id };
  client.name = socket.handshake.name;
  client.role = socket.handshake.role;
  
  socket.join(socket.handshake.room);
  
  if(socket.handshake.room in io.sockets.manager.rooms) {
  	clients[socket.handshake.room].push(client);
  }else {
  	clients[socket.handshake.room] = [];
  	clients[socket.handshake.room].push(client);
  }
  console.log(clients[socket.handshake.room]);
  
  //Tell people that a new peer connected to their room
  socket.emit('hello', { message: 'Hello '+socket.handshake.name+', Welcome to '+socket.handshake.room });
  
  //Send the get_peers to client on connection
  socket.emit('get_peers',
      {
        connections: clients[socket.handshake.room],
        you: client
      });
  
  //If an offer has already been made send it to the new client for connection
  if(socket.handshake.room in offers) {
  	data = offers[socket.handshake.room];
  	socket.emit('receive_offer', data);
  }
  
  //Let everyone else in the room know your are here
  socket.broadcast.to(socket.handshake.room).emit('new_peer_connected', client);
  
  
  socket.on('message', function (message) {
      io.sockets.in(socket.handshake.room).emit('message', message);
  });
  
  //Receive and Send ICE canidates to room memebers
  socket.on('send_ice_candidate', function(data){
  	console.log('recieved ice candidate');
  	
  	 socket.broadcast.to(socket.handshake.room).emit('receive_ice_candidate',
        {
          label: data.label,
          candidate: data.candidate,
          socketId: socket.id
  		});
  	});
  	
  //Receive offer and send to correct socket
  socket.on('send_offer', function(data) {
    var data = { sdp: data.sdp, socketId: socket.id };
    offers[socket.handshake.room] = data;	
    socket.broadcast.to(socket.handshake.room).emit('receive_offer', data);
    
  });
  
  socket.on('disconnect', function(){
  	var id = socket.id;
  	var room = socket.handshake.room;
  	
  	http.get(socket.handshake.origin+'/chats/chats/destroy/'+socket.handshake.key+'.json', function(res){
  		if(res.statusCode == 200) {
  			socket.broadcast.to(room).emit('client_disconnect', id);
  		}
  	});
  	
  	if(socket.handshake.room in io.sockets.manager.rooms) {
  		for (var i=0;i<clients[socket.handshake.room].length;i++) {
				if(clients[socket.handshake.room][i].id == id) {
					delete clients[socket.handshake.room][i];	
				}
			}
  	}
  	
  	socket.leave(socket.handshake.room);
  		
  });
  
});