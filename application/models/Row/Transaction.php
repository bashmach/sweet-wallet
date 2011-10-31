<?php

class Application_Model_Row_Transaction extends Zend_Db_Table_Row_Abstract
{
    public function __get($key)
    {
        switch ($key) {
            case 'value':
                $value = $this->_data[$key];
                
                return round($value / 1000, 3);
                break;
            default:
                return $this->_data[$key];
                break;
        }
    }
}