<?php

class Application_Model_Transaction extends Application_Model_Abstract
{
    protected $_dbTableClassName = 'Application_Model_DbTable_Transaction';
    
    const TYPE_EXPENSE = 1;
    const TYPE_INCOME = 2;
    
    public function add($data, $type)
    {
        try {
            $data = array(
                'userId' => $data['userId'],
                'categoryId' => $data['category'],
                'date' => $data['date'],
                'value' => ceil($data['amount'] * 1000),
                'comment' => '',
                'created' => date('Y-m-d H:i:s'),
                'type' => $type
            );
            
            $row = $this->getTable()->createRow($data);
            $row->save();
            
            return $row;
        } catch (Application_Model_Exception $e) {
            throw new Application_Model_Exception($e->getMessage());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    
    private function _getFindSelect()
    {
        return $this->getTable()
            ->select()
            ->setIntegrityCheck(false)
            ->from($this->getTable()->info('name'))
            ->columns(
                array(
                    'category' => 'category.name'
                )
            )
            ->join('category', 'category.id = categoryId', array());
    }
    
    public function find($id)
    {
        $select = $this->_getFindSelect()
            ->where('transaction.id = ?', $id);
        
        return $this->getTable()->fetchRow($select);
    }
    
    public function findAll()
    {
        $select = $this->_getFindSelect()
            ->order(array('date DESC', 'created DESC'));
        
        return $this->getTable()->fetchAll($select);
    }
}