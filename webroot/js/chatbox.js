(function($) {
	
	var key = chatbox.data('key') 
	var socket = new WebSocket('ws://192.168.1.8:1337/'+key);
	var chatbox = $('#ChatBox');
	
	
	socket.onopen(function(evt) {
		var agentname = chatbox.data('name');
		chatbox.append('<div class="chatter chatter-'+name+'">'+name+' is now online</div>');
	});
	
	socket.onMessage(function(evt) {
		chatbox.append('<div class="chatter chatter-'+evt.data['name']+'">'+evt.data['message']+'</div>');
	});
	
	
	
	
	
})(jQuery);




