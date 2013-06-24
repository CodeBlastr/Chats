<?php
/**
 * ChatFixture
 *
 */
class ChatFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'string', 'null' => false, 'default' => NULL, 'length' => 36, 'collate' => 'utf8_general_ci', 'charset' => 'utf8', 'key' => 'primary'),
		'chat_hash' => array('type' => 'integer', 'null' => false, 'default' => NULL),
		'creator_id' => array('type' => 'integer', 'null' => false, 'default' => NULL),
		'created' => array('type' => 'datetime', 'null' => false, 'default' => NULL),
		'indexes' => array(),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => '51c4bc1f-07d8-41f2-bec5-7737cbdd56cb',
			'chat_hash' => 1,
			'creator_id' => 1,
			'created' => '2013-06-21 16:48:31'
		),
	);
}
