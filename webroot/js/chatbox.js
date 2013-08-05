var socket = '';
var otherusers = [];
var me = '';

(function($) {
	
	if(room == ''){
		var url = "/chats/chats/getchatkey.json";
	}else {
		var url = "/chats/chats/getchatkey/"+room+".json";
	}
	
	var heightadj = 0;
	
	$(document).ready(function() {
			var request = $.ajax({
  				url: url,
  				type: "POST",
  				dataType: "json",
  				success: function(data) {
  					startSocket(data);
  				}
  			});
  			heightadj =+ $('#adminNavFloManagr').height();
  			chatbox.css('margin-bottom', heightadj);
	});
	
	var chatbox =  $('#ChatBox');
	
	//Defaults on chatbox
	chatbox.css('max-height', $(window).height()*.8);
	
	var closed = true;
	var whosclosed = false;

	
	function startSocket(data) {
		
		var chatkey = data.data.Chat.chat_hash;
		var chatroom = data.data.Chat.room;
		var chatname = data.data.Chat.name;
		
		socket = io.connect('ws://192.168.1.8:1337/', { query: "key="+chatkey+"&room="+chatroom+"&name="+chatname+"&role="+roleVideo });
		
		socket.on('error', function () {
			console.log('Chat Unavailable');
		});
		
		socket.on('connect', function () {
			toggleChat();
			if(video) {
				rtc.connect();
			}
		});
		
		socket.on('hello', function (data) {
			chatbox.find('.welcome .msg').html(data.message);
			chatbox.find('#chatActionWrapper').removeClass('hidden');
		});
		
		socket.on('message', function (data) {
			renderChatMessage(data);
		});
		
		socket.on('new_peer_connected', function (data) {
			otherusers.push(data);
			whosOnline(data);
		});
		
		socket.on('client_disconnect', function (data) {
			for (var i=0;i<otherusers.length;i++) {
				if(otherusers[i].id === data) {
					otherusers.splice(i,1);	
				}
			}
			$('#'+data).remove();
			$('#chatActionWrapper').css('margin-bottom', $('#chatUserOnline').height()*-1);
			
		});
		
		socket.on('get_peers', function (data) {
			otherusers = data.connections;
			me = data.you;
			whosOnline();
		})
		
		
		$('#chatBtn').on('click', function (e) {
			e.preventDefault();
			var message = $('#chatInput').val();
			var data = {id: me, name: chatname, message: message};
			$('#chatInput').val('');
			if(message != ''){
				socket.emit('message', data);
			}
			
		});
		
		
		$('#ChatBox .close-chat').on('click', function (e) {
			e.preventDefault();
			toggleChat()
		});
		
		
		
		
		$('#chatUserOnline').on('click', '.link', function(e) {
			e.preventDefault();
			toggleWhosOnline();
		});
		
	}
	
	function toggleWhosOnline() {
			if(whosclosed === false) {
				$('#chatActionWrapper').animate({
				    marginBottom: ($('#chatUserOnline').height())*-1
  				},500, function() {
    				$('#chatUserOnline .link i').removeClass('icon-circle-arrow-down').addClass('icon-circle-arrow-up');
    				whosclosed = true;
  				});
			}else {
				$('#chatActionWrapper').animate({
				    marginBottom: 0
  				},500, function() {
    				$('#chatUserOnline .link i').removeClass('icon-circle-arrow-up').addClass('icon-circle-arrow-down');
  					whosclosed = false;
  				});
			}
	}
		
	function toggleChat() {
		if(closed == false) {
			chatbox.animate({
			    bottom: (chatbox.height()*-1)+heightadj
			},1000, function() {
				closed = true;
				$('#ChatBox .close-chat i').removeClass('icon-circle-arrow-down').addClass('icon-circle-arrow-up');
			});
		}else {
			chatbox.animate({
			    bottom: 0
			},1000, function() {
				closed = false;
				$('#ChatBox .close-chat i').removeClass('icon-circle-arrow-up').addClass('icon-circle-arrow-down');
			});
		}
	}
	
	function whosOnline(user) {
		if (typeof user === 'undefined') {
			for (var i=0;i<otherusers.length;i++) {
					$.get(
						"/chats/chats/getUserInfo/"+otherusers[i].key+".json", { index: i }, "success", "json").done(
					 	function(data) {
					 		userDetailResponse(data);
						});
				}
		}else {
			var userindex;
			var newuser = $.grep(otherusers, function (otheruser, arrindex) { 
					userindex = arrindex;
					return otheruser.id === user.id;
				});
				$.get(
					"/chats/chats/getUserInfo/"+newuser[0].key+".json", { index: userindex }, "success", "json").done(
				 	function(data) {
				 		userDetailResponse(data);
					});
			}
	}
	
	function userDetailResponse (data) {
		otherusers[data.index].image = data.User.GalleryImage;
		otherusers[data.index].username = data.User.User.username;
		renderOnlineUser(data.index);
	}
	
	function renderOnlineUser(index) {
		var html = '';
		html += '<li id="'+otherusers[index].id+'" class="online-user clearfix"><div class="user-image"><img width="25" height="25" src="'+otherusers[index].image+'" /></div>';
		html += '<div class="name">'+otherusers[index].name+'</div>';
		html += '<div class="links"><i class="icon-envelope" data-index="'+index+'"></i></div></li>';
		$('#chatUserOnline ul li').last().after(html);
	}
	
	function renderChatMessage(data) {
		var user;
		var html = '';
		//Clean string
		
		data.message = data.message;
		
		//Find the User
		user = $.grep(otherusers, function (other, arrindex) {
					return other.id == data.id.id
		});
		
		user = user[0];
		if (user.id === me.id) {
			html += '<div class="chat-message-me">';
		}else {
			html += '<div class="chat-message">';
		}
		
		html += '<div class="chat-user">';
		if(user.image == '' || user.image === undefined) {
			html += '<img width="40" height="40" src="/img/noImage.jpg" />';
		}else {
			html += '<img width="40" height="40" src="'+user.image+'" />';	
		}
		html += '<div class="name">'+user.name+'</div>';
		html += '</div>';
		html += '<div class="message"><div>'+data.message+'</div></div>';
		html += '<div class="clearfix"></div>';
		html += '</div>';
		
		chatbox.find('.message-area .msgwrapper').append(html);
		
		var msgarea = chatbox.find('.message-area');
		var calcheight = parseInt(chatbox.css('max-height').match(/\d+/), 10)-$('.welcome').height()-$('#chatActionWrapper').height()-heightadj;
		if(msgarea.height() > calcheight) {
			msgarea.css('height', calcheight+'px');
		}
		msgarea.animate({ 
			   scrollTop: msgarea.find('.msgwrapper').height()}, 
			   500
			);
	}
	
	function htmlUnescape(value){
	    return String(value)
	        .replace(/&quot;/g, '"')
	        .replace(/&#39;/g, "'")
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&amp;/g, '&');
	}
	
	
})(jQuery);




