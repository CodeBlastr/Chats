(function($) {
	
	var chatbox = $('#ChatBox');
	var chatkey = chatbox.data('key');
	var chatroom = chatbox.data('room');
	var chatname = chatbox.data('name');
	var socket = io.connect('ws://192.168.1.8:1337/', { query: "key="+chatkey+"&room="+chatroom+"&name="+chatname });
	
	
	socket.on('hello', function (data) {
		chatbox.find('.message-area').append('<div class="chat-message">'+data.message+'</div>');
	});
	
	socket.on('message', function (data) {
	    chatbox.find('.message-area').append('<div class="chat-message">'+data.name+' - '+data.message+'</div>');
	});
	
	
	$('#chatBtn').on('click', function (event) {
		var data = {name: chatname, message: $('#chatInput').val()};
		console.log(data);
		socket.emit('message', data);
	});
	
})(jQuery);




