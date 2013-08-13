<?php
App::uses('AppModel', 'Model');
/**
 * Chat Model
 *
 */
class Chat extends AppModel {
	
	public $belongsTo = array(
        'User' => array(
            'className' => 'Users.User',
            'foreignKey' => 'creator_id'
        )
    );
	
	/**
	 * Before save - Generates a hash with the User ID to generate a Hash Key
	 */
	 
	 public function beforeSave($options = array()) {
	 	parent::beforeSave($options);
	 	$this->data['Chat']['chat_hash'] = Security::hash(uniqid(), 'sha1', true);
		
	 }
	 
	 /**
	  * This is the check key funciton. Used by the chat server to verify that the user is logged in an allowed
	  * to use the chat. and that the request actually came from our website.
	  * 
	  * @param $key - the key generated when the user opens an chat window.
	  * @return bool - True if key exists
	  */
	  
	 public function checkChatKey($key) {
	 	$chat = $this->find('first', array(
			'conditions' => array('chat_hash' => $key),
		));
		
		if(isset($chat) && !empty($chat)) {
			return true;
		}
		
		return false;
	 }
	 
	 /**
	  * Gets User Associated with the key
	  * @param $key - chat hashed key
	  * @return array - User
	  */
	  
	  public function getUserByKey($key) {
	  	 
		 $chat = $this->findByChatHash($key);
		 
		 $user = $this->User->find('first', array(
		 		'conditions' => array('id' => $chat['Chat']['creator_id']),
		 		'fields' => array('username'),
				'contain' => array(
					'Gallery' => array(
						'fields' => array('id', 'gallery_thumb_id'),
						'GalleryImage'
					)
				)
				));
		//Clean up the array remove unecessay data 
		$user['GalleryImage'] = $user['Gallery'][0]['GalleryImage'][0]['dir'] . $user['Gallery'][0]['GalleryImage'][0]['filename'];
		unset($user['Gallery']);
		return $user;
		 
	  }
	 
}
