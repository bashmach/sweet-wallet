<?php

class TransactionsController extends Zend_Controller_Action {

    public function init() 
    {
        $this->model = new Application_Model_Transaction();
        
        $this->_helper->layout()->disableLayout();
    }

    public function listAction() 
    {
        $this->view->transactions = $this->model->findAll(
            array(
                'id',
                'name',
                'created'
            )
        );
    }
}

