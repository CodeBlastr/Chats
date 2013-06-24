(function($) {
	
	var socket = new WebSocket('ws://192.168.1.8:1337/');
	var chatbox = $('#ChatBox');
	
	
	socket.onopen(function(evt) {
		var agentname = chatbox.data('name');
		chatbox.append('<div class="chatter chatter-'+name'">'+name+' is now online</div>');
	});
	
	socket.onMessage(evt) {
		
	}
	
	
	
	
	
})(jQuery);




