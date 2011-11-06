<?php

class Application_Model_DbTable_Transaction extends Zend_Db_Table_Abstract
{
    protected $_name = 'transaction';

    protected $_primary = 'id';
    
    protected $_rowClass = 'Application_Model_Row_Transaction';
}   