<?php

class Application_Model_Category extends Application_Model_Abstract
{
    protected $_dbTableClassName = 'Application_Model_DbTable_Category';
    
    public function findAll($columns = '*', $order = 'name DESC')
    {           
        return $this->getTable()->fetchAll(
            $this->getTable()->select()
                ->from($this->getTable()->info('name'))
                ->columns($columns)
                ->order($order)
        );
    }
}