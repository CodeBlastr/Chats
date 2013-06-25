(function($) {
	
	var chatbox = $('#ChatBox');
	var chatkey = chatbox.data('key');
	var chatroom = chatbox.data('room');
	var chatname = chatbox.data('name');
	var socket = io.connect('ws://192.168.1.8:1337/', { query: "key="+chatkey+"&room="+chatroom+"&name="+chatname });
	
	
	socket.on('hello', function (data) {
		console.log(data);
	});
	
	socket.on('message', function (data) {
	    console.log(data);
	});
	
	
	
	
	
})(jQuery);




