<?php
App::uses('Chat', 'Model');

/**
 * Chat Test Case
 *
 */
class ChatTestCase extends CakeTestCase {
/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array('app.chat');

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Chat = ClassRegistry::init('Chat');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Chat);

		parent::tearDown();
	}
	
	public function testSave() {
		//We simply just save to create a new key.
        $this->Chat->save();
        $result = $this->Chat->findById($this->Chat->id);
        $this->assertEqual($result['Chat']['id'], $this->Chat->id);  // make sure the item was added
        $this->assertEqual($result['Chat']['chat_hash'], $this->Chat->chat_hash); // make sure that key was created
	}

}
