<?php

class Application_Model_Transaction extends Application_Model_Abstract
{
    protected $_dbTableClassName = 'Application_Model_DbTable_Transaction';
    
    const TYPE_EXPENSE = 1;
    const TYPE_INCOME = 2;
    
    public function add($data, $type)
    {
        try {
            $row = $this->getTable()->createRow(array());
            $row->userId = $data['userId'];
            $row->categoryId = $data['category'];
            $row->date = $data['date'];
            $row->value = $data['amount'];
            $row->created = date('Y-m-d H:i:s');
            $row->comment = '';
            
            $row->save();
            
            return $row;
        } catch (Application_Model_Exception $e) {
            throw new Application_Model_Exception($e->getMessage());
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
    
    public function edit($data)
    {
        try {
            $row = $this->getTable()->find($data['identifier'])->current();
            
            $row->categoryId = $data['category'];
            $row->date = $data['date'];
            $row->value = $data['amount'];
            
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