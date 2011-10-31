<?php

class Application_Model_Abstract
{
    protected $_dbTableClassName;
    
    protected $_dbTable;
    
    protected function getTable()
    {
        if (!$this->_dbTable) {
            $this->_dbTable = new $this->_dbTableClassName;
        }
        
        return $this->_dbTable;
    }
}
