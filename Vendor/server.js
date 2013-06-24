var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var rooms = [];

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});


server.listen(1337, function() {
  console.log((new Date()) + " Server is listening on port 1337");
});

// create the server
wsServer = new WebSocketServer({
     httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}

wsServer.request(function(request)) {
	console.log(request);
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    
    
    var connection = request.accept(null, request.origin);
    
    console.log(' Connection ' + connection.remoteAddress);
    
    
    clients.push(connection);
    if(presenterMessage != null) {
    	connection.send(presenterMessage, sendCallback);
    }
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
    	console.log(message.type);
        if (message.type === 'utf8') {
        	console.log(message.utf8Data);
        	var msgObj = JSON.parse(message.utf8Data);
            // process WebSocket message
    
            if(msgObj.type === 'chat') {
            	console.log((new Date()) + ' Received Chat from: ' + request.origin + ' message: ' + message.utf8Data);
            	clients.forEach(function (outputConnection) {
	                  outputConnection.send(message.utf8Data, sendCallback);
	            });
            }
            
            if(msgObj.type === 'offer') {
            	console.log((new Date()) + ' Received Presenter Description: ' + message.utf8Data);
            	presenterConnection = connection;
            	presenterMessage = message.utf8Data;
            	
	            // broadcast message to all connected clients
	            clients.forEach(function (outputConnection) {
	                if (outputConnection != connection) {
	                  outputConnection.send(message.utf8Data, sendCallback);
	                }
	            });
            }
            
            if(msgObj.type === 'answer') {
            	presenterConnection.send(message.utf8Data, sendCallback);
            }
            
            if(msgObj.type === 'candidate') {
            	clients.forEach(function (outputConnection) {
	               if (outputConnection != connection) {
	                  outputConnection.send(message.utf8Data, sendCallback);
	               }
	            });
            }
            
        }
        if (message.type === 'binary') {
        	
        	console.log('streaming....');
        }
    });
    
    connection.on('close', function(connection) {
        // close user connection
        if(connection == presenterConnection) {
        	presenterConnection = null;
        	presenterMessage = null;
        	console.log('presenter closed connection');
        }
        console.log((new Date()) + " Peer disconnected.");        
    });
});