<?php

class CategoriesController extends Zend_Controller_Action {

    public function init() 
    {
        $this->model = new Application_Model_Category();
        
        $this->_helper->layout()->disableLayout();
    }

    public function listAction() 
    {
        $this->view->categories = $this->model->findAll(
            array(
                'id',
                'name',
                'created'
            )
        );
    }

}

