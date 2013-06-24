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
/**
 * view method
 *
 * @param string $id
 * @return void
 */
	public function view() {
		$this->layout = null;
		//Create the chat key
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
						$this->set(compact($key, $uid, $name));
					}else {
						throw new ForbiddenException();
					}
				
			}else {
				$this->view = 'response';
				$data = $this->Chat->save();
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
	public function check_key($uid = null, $key = null) {
		$this->view = 'response';
		
		//Do Not allow Get
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
		
		if(!isset($this->request->data['uid']) || !isset($this->request->data['key'])) {
			throw new ForbiddenException();
		}
		
		$uid = $this->request->data['uid'];
		$key = $this->request->data['key'];
		if ($this->Chat->checkChatKey($key, $uid)) {
			$data = array(
				'isValid' => true,
			);
			$this->set('data', $data);
		}
		
		throw new ForbiddenException();
	}
	
	/**
	 * Checks if a user can create a room on the chat socket.
	 * if they can create a room sends room creation data back 
	 * to server
	 */
	
	public function create_room() {
		
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}	
			
		$this->view = 'response';
		$uid = $this->request->data['uid'];
		$key = $this->request->data['key'];
		
		//Sets the room to The site name if not provided
		if(isset($this->request->data['room'])) {
			$room = $this->request->data['room'];
		}else {
			$room = __SYSTEM_SITE_NAME;
		}
		
		if ($this->Chat->checkChatKey($key, $uid)) {
			$data = array(
				'uid' => $uid,
				'room' => $room,
				'key' => $key
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
