<?php
	
	/**
	 * Chatbox Element Displays a chat box on the right side of the screen
	 * 
	 * @param $room - The name of the chat room
	 * 
	 */


?>

<div id="ChatBox">
	<div class="welcome">
		<div class="close-chat">
			<a href="#"><i class="icon-circle-arrow-up"></i></a>
		</div>
		<div class="msg">Chat is Unvavailable</div>
		</div>
		
	<div class="message-area">
		<div class="msgwrapper"></div>
	</div>
	
	
	<div id="chatActionWrapper" class="hidden">
		<div id="chatAction" class="clearfix">
			<textArea type="textInput" id="chatInput"></textArea><button id="chatBtn" class="btn">Send Message</button>
			<div class="clear"></div>
		</div>
		<div id="chatUserOnline">
			<div class="title"><?php echo __("Who's Online"); ?><a href='#' class="link"><i class="icon-circle-arrow-down"></i></a></div>
			<ul>
				<li style="display: none;"></li>
			</ul>
		</div>
	</div>
	
</div>

<script type="text/javascript" src="/Chats/js/socket.io.min.js"></script>
<script type="text/javascript">var room = '<?php echo isset($room) ? $room : ''; ?>';</script>
<script type="text/javascript" src="/Chats/js/chatbox.js"></script>
<link rel="stylesheet" type="text/css" href="/Chats/css/chatbox.css" />