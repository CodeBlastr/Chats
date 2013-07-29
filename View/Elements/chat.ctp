	<div id="ChatBox">
		<div class="message-area">
			<p>Chat is Currently Unavailable</p>
		</div>
		
		<div id="chatAction" class="well hidden">
			<input type="textInput" id="chatInput" /><button id="chatBtn" class="btn">Send Message</button>
		</div>
		
	</div>
	
	<div id="chatUserOnline">
		<ul>
			
		</ul>
	</div>
		

<style>
	#ChatBox {
		position: fixed;
		top: 50px;
		right: 0px;
		width: 300px;
		border: 1px solid #000;
		background: #ccc;
		overflow: hidden;
		padding: 10px;
		border-bottom-left-radius: 20px;
		border-top-left-radius: 20px;
	}
	
	#ChatBox .message-area {
		margin-bottom: 116px;
		max-height:240px;
		overflow-y:auto;
	}
	
	#chatAction {
    	margin-left: -10px;
    	position: absolute;
    	top: 271px;
    	width: 280px;
	}
	#chatAction #chatInput {
		margin-bottom: 8px;
    	width: 100%;
	}
</style>

<script src="/Chats/js/socket.io.min.js"></script>
<script type="text/javascript" src="/Chats/js/chatbox.js"></script>
<link rel="stylesheet" type="text/css" href="/Chats/css/chatbox.css" />