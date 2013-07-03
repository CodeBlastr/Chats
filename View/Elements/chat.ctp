<?php debug($chat); ?>
<?php if(isset($chat['Chat']['chat_hash']) && isset($chat['Chat']['room'])): ?>
	
	<div id="ChatBox" data-name="<?php echo $chat['Chat']['name'] ?>" data-key="<?php echo $chat['Chat']['chat_hash']; ?>" data-room="<?php echo $chat['Chat']['room']; ?>">
		<div class="message-area">
		
		</div>
		<div id="chatAction" class="well">
			<input type="textInput" id="chatInput" /><button id="chatBtn" class="btn">Send Message</button>
		</div>
		
	</div>
	
<?php else: ?>
		
	<div id="ChatBox" data-name="<?php echo $chat['Chat']['name'] ?>" data-key="<?php echo $chat['Chat']['chat_hash']; ?>" data-room="<?php echo $chat['Chat']['room']; ?>">
		<div class="message-area" style="float:left;">
			<p>Chat is Currently Unavailable</p>
		</div>
	</div>
		
<?php endif; ?>

<style>
	#ChatBox {
		position: fixed;
		top: 50px;
		right: 0px;
		width: 300px;
		height: 357px;
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