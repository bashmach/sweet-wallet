<?php

class Application_Model_Row_Transaction extends Zend_Db_Table_Row
{
    protected $_tableClass = 'Application_Model_DbTable_Transaction';
    
    public function __set($key, $value)
    {   
        switch ($key) {
            case 'value':
                $value = ceil($value * 1000);
                break;
        }
        
        return parent::__set($key, $value);
    }
    
    public function __get($key)
    {
        $value = parent::__get($key);
        
        switch ($key) {
            case 'value':
                return round($value / 1000, 3);
                break;
            default:
                return $value;
                break;
        }
    }
    
    public function toStoreValue()
    {
        return array(
            'id' => $this->id,
            'categoryId' => $this->categoryId,
            'amount' => $this->value,
            'date' => $this->date,
            'created' => $this->created,
            'bool' => false
        );
    }
}