var http = require('http');

http.createServer(function (req, res) {
  
});


var xmlHttp = null;
var clients = [];
var offers = [];

var io = require('socket.io').listen(1337);

io.configure('production', function(){
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging

  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function(){
  io.set('transports', ['websocket']);
});



io.set('authorization', function (handshakeData, cb) {
    //Get the origin of the request fromt the headers
  	var origin = handshakeData.headers.origin;
  	handshakeData.origin = origin;
    var key = handshakeData.query.key;
    handshakeData.key = key;
    var room = handshakeData.query.room;
    var role = handshakeData.query.role;
    
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

  var client = {}	
  client.id = socket.id
  client.name = socket.handshake.name;
  client.role = socket.handshake.role;
  client.room = socket.handshake.room;
  client.key = socket.handshake.key;
  client.socket = socket;
  
  clients[socket.id] = client;
  socket.join(socket.handshake.room);
  //Tell people that a new peer connected to their room
  socket.json.emit('hello', { message: 'Hello '+socket.handshake.name+', Welcome to '+socket.handshake.room });
  
  //Send the get_peers to client on connection
  peers = [];
  for (var j=0 ; j < io.sockets.clients(socket.handshake.room).length ; j++) {
  		var peer = {}
  		peer.id = clients[io.sockets.clients(socket.handshake.room)[j].id].id;
  		peer.name = clients[io.sockets.clients(socket.handshake.room)[j].id].name;
  		peer.role = clients[io.sockets.clients(socket.handshake.room)[j].id].role;
  		peer.room = clients[io.sockets.clients(socket.handshake.room)[j].id].room;
  		peer.key = clients[io.sockets.clients(socket.handshake.room)[j].id].key;
		peers.push(peer);
  }
  
  console.log(peers);
  socket.json.emit('get_peers',
      {
        connections: peers,
        you: {id: client.id, name: client.name, role: client.role, room: client.room, key: client.key }
      });
  
  //If an offer has already been made send it to the new client for connection
  // if(socket.handshake.room in offers) {
  	// data = offers[socket.handshake.room];
  	// socket.json.emit('receive_offer', data);
  // }
  
  //Let everyone else in the room know your are here
  socket.broadcast.to(socket.handshake.room).json.emit('new_peer_connected', 
  		{ id: client.id, name: client.name, role: client.role, room: client.room, key: client.key }
  	);
  
  
  socket.on('message', function (message) {
  	  message.message = htmlEscape(message.message);
      io.sockets.in(socket.handshake.room).json.emit('message', message);
  });
  
  //Receive and Send ICE canidates to room memebers
  socket.on('send_ice_candidate', function(data){
  	 clients[data.socketId].socket.json.emit('receive_ice_candidate',
        {
          label: data.label,
          candidate: data.candidate,
          socketId: socket.id
  		});
  	});
  	
  //Receive offer and send to correct socket
  socket.on('send_offer', function(data) {
  	var senderid = data.socketId;
  	console.log(data);
  	console.log(clients[senderid]);
    var data = { sdp: data.sdp, socketId: socket.id };
    //offers[socket.handshake.room] = data;
    clients[senderid].socket.emit('receive_offer', data);  
  });
  
  socket.on('send_answer', function(data) {
  	var senderid = data.socketId;
    var data = { sdp: data.sdp, socketId: socket.id };
    //offers[socket.handshake.room] = data;	
    clients[senderid].socket.emit('receive_answer', data);  
  });
  
  socket.on('disconnect', function(){
  	var id = socket.id;
  	var room = socket.handshake.room;
  	
  	http.get(socket.handshake.origin+'/chats/chats/destroy/'+socket.handshake.key+'.json', function(res){
  		if(res.statusCode == 200) {
  			socket.json.broadcast.to(room).emit('client_disconnect', id);
  		}
  	});
  	
  	var i = 0;
    for (c in clients) {
  		console.log(c);
  		if(c == id) {
      		clients.splice(i, 1);
  		}
  		i++;
  	}
  	
  	// if(room in offers) {
		// if(offers[room].socketId == id) {
			// delete offers[room];
			// console.log('Removed Offer: '+id);
		// }
	// }
  		
  });
  
  socket.on('remove_stream', function(data) {
    //offers[socket.handshake.room] = data;	
    socket.json.broadcast.to(socket.handshake.room).emit('remove_stream', data);
  });
  
});

function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}