<?php

class IndexController extends Zend_Controller_Action {

    public function init() 
    {
        /* Initialize action controller here */
    }

    public function indexAction() 
    {
        $this->categoryModel = new Application_Model_Category();
        $this->view->categories = $this->categoryModel->findAll(
            array(
                'id',
                'name',
                'created'
            )
        );
        
        $this->view->form = new Application_Form_Expense_Add();
    }
}

