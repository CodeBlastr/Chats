(function($) {
	
	$(document).ready(function() {
			var request = $.ajax({
  				url: "/chats/chats/getchatkey.json",
  				type: "POST",
  				dataType: "json",
  				success: function(data) {
  					startSocket(data);
  				}
  			});
	});
	
	
	function startSocket(data) {
		console.log('Starting Socket');
		console.log(data);
		
		var chatbox =  $('#ChatBox');
		var me = '';
		var chatkey = data.data.Chat.chat_hash;
		var chatroom = data.data.Chat.room;
		var chatname = data.data.Chat.name;
		var otherusers = [];
		var socket = io.connect('ws://192.168.1.8:1337/', { query: "key="+chatkey+"&room="+chatroom+"&name="+chatname });
		
		socket.on('error', function () {
			
		})
		
		socket.on('hello', function (data) {
			console.log(data);
			chatbox.find('.message-area').html('<div class="chat-message welcome">'+data.message+'</div>');
			chatbox.find('#chatAction').removeClass('hidden');
			
		});
		
		socket.on('message', function (data) {
		    chatbox.find('.message-area').append('<div class="chat-message">'+data.name+' - '+data.message+'</div>');
		});
		
		socket.on('new_peer_connected', function (data) {
			console.log(data);
			otherusers.push(data);
			whosOnline(otherusers);
		});
		
		socket.on('client_disconnect', function (data) {
			for (var i=0;i<otherusers.length;i++) {
				if(otherusers[i].data == data) {
					delete otherusers[i];	
				}
			}
			
			whosOnline(otherusers);
		});
		
		socket.on('get_peers', function (data) {
			console.log(data);
			otherusers = data.connections;
			me = data.you;
			whosOnline(otherusers);
		})
		
		
		$('#chatBtn').on('click', function (event) {
			var data = {name: chatname, message: $('#chatInput').val()};
			console.log(data);
			socket.emit('message', data);
		});
	}
	
	function whosOnline(otherusers) {
		console.log(otherusers);
		if(otherusers.length > 0) {
			var html = '';
			for (var i=0;i<otherusers.length;i++) {
				html += '<li><div class="name">'+otherusers[i].name+'</div></li>';
			}
		}
		console.log(html);
		$('#chatUserOnline ul').html(html);
	}
	
	
})(jQuery);




