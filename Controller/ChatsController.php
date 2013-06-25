<?php
App::uses('AppController', 'Controller');
/**
 * Chats Controller
 *
 * @property Chat $Chat
 */
class ChatsController extends AppController {
	
	public $layout = null; //Setting this here because its mostly ajax calls

	public $uses = array('Chats.Chat');
	
	public $allowedActions = array('check_key', 'create_room');
/**
 * view method
 *
 * @param string $id
 * @return void
 */
	public function view($room = null) {
		$this->layout = null;
		
		if(isset($this->request->data['Chat']['room'])) {
			$room = $this->request->data['Chat']['room'];
		}
		
		if(!isset($room)) {
			$room = __SYSTEM_SITE_NAME;
		}
		
		if($this->request->isAjax()) {
			//If Key is set and the room is set send the view for the chat boxes
			//else create the key and send the json back
			if(isset($this->request->data['Chat']['chat_hash'])) {
					$key = $this->request->data['Chat']['chat_hash'];
					$uid = $this->Session->read('Auth.User.id');
					if($uid == __SYSTEM_GUESTS_USER_ROLE_ID) {
						$name = 'guest' . uniqid();
					}else {
						$name = $this->Session->read('Auth.User.full_name');
					}
					//Checks the key and send data to the view
					if($this->Chat->checkChatKey($key, $uid)) {
						$this->set('key', $key);
						$this->set('uid', $uid);
						$this->set('name', $name);
						$this->set('room', $room);
					}else {
						throw new ForbiddenException();
					}
				
			}else {
				$this->view = 'response';
				$data = $this->Chat->save();
				$data['Chat']['room'] = $room;
				$this->set('data', $data);
			}
			
		}else {
			debug('fail');
			throw new MethodNotAllowedException();
		}
		
		
		
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
		$this->view = 'response';
		
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
			
		$this->view = 'response';
		//Sets the room to The site name if not provided
		
		
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
		$this->view = 'response';
		$result = $this->Chat->find('first', array('conditions' => array('chat_hash' => $key)));
		//removes the key so it can't be used again.
		if($this->Chat->delete($result['Chat']['id'])) {
			$this->set('data', array('keydeleted' => 'success'));
		}else {
			throw new ForbiddenException();
		}
		
	}
	
	public function testChat() {
		
	}
}
