<?php
	
	/**
	 * View File This should be called with a helper
	 */
	if(isset($room)) {
		echo $this->element('Chats.chatbox', $name, $key);
	}
	else {
		echo $this->element('Chats.unavailable');
	}
	
	
?>

<script type="text/javascript" src="/Chats/js/chatbox.js"></script>