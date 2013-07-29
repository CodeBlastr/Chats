<?php

/**
 * Setting for extended Controllder
 * $refuseInit = true; require_once(ROOT.'/app/Plugin/Chats/Controller/ChatsController.php');
 */

App::uses('AppController', 'Controller');
/**
 * Chats Controller
 *
 * @property Chat $Chat
 */
class _ChatsController extends AppController {
	
	public $uses = array('Chats.Chat');
	
	public $allowedActions = array('check_key', 'create_room', 'destroy');


	public function getchatkey($room = null) {
		
		if(!isset($room)) {
			$room = __SYSTEM_SITE_NAME;
		}
		
		$data = $this->Chat->save();
		$data['Chat']['room'] = $room;
		if($uid == __SYSTEM_GUESTS_USER_ROLE_ID) {
			$name = 'guest' . uniqid();
		}else {
			$data['Chat']['name'] = $this->Session->read('Auth.User.full_name');
		}
		
		$this->set('data', $data);
		
	} 


/**
 * Checks if the key provided is valid or not.
 * Used by socket to verify the key
 *
 * @param $key - string key
 * @param $uid - int
 * @return void
 */
	public function check_key($key) {
		
		if(!isset($key)) {
			throw new ForbiddenException();
		}
		
		if ($this->Chat->checkChatKey($key)) {
			$data = array(
				'isValid' => true,
			);
			$this->set('data', $data);
		}else {
			throw new ForbiddenException();
		}
	}
	
	/**
	 * Checks if a user can create a room on the chat socket.
	 * if they can create a room sends room creation data back 
	 * to server
	 */
	
	public function create_room($key) {
		
		if(!isset($key)) {
			throw new ForbiddenException();
		}
		
		if ($this->Chat->checkChatKey($key)) {
			$data = array(
				'isValid' => true,
			);
			$this->set('data', $data);
		}else {
			throw new ForbiddenException();
		}
		
	}
	
	/**
	 * Method to destroy the chat key.
	 * Sent by chat socket when socket is closed on server
	 */
	public function destroy($key) {
		
		//removes the key so it can't be used again.
		if($this->Chat->deleteAll(array('Chat.chat_hash' => $key), false)) {
			$this->set('data', true);
		}else {
			throw new ForbiddenException();
		}
		
	}
	
	public function testChat() {
		
	}
}

if (!isset($refuseInit)) {
	class ChatsController extends _ChatsController {}
}
