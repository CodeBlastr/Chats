<?php
	
	/**
	 * View File This should be called with a helper
	 */
	if(isset($key)) {
		echo $this->element('Chats.chatbox', $name, $key);
		
		echo '<script src="/Chats/js/socket.io.min.js"></script>';
		echo '<script type="text/javascript" src="/Chats/js/chatbox.js"></script>';
	}
	else {
		echo $this->element('Chats.unavailable');
	}
	
	
?>

<link rel="stylesheet" type="text/css" href="/Chats/css/chatbox.css" />