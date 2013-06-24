(function($) {
	
	var chatbox = $('#ChatBox');
	var chatkey = chatbox.data('key'); 
	var socket = io.connect('ws://192.168.1.8:1337/');
	
	
	  socket.on('news', function (data) {
	    console.log(data);
	    socket.emit('key', { key: chatkey });
	  });
	
	
	
	
	
})(jQuery);




