<?php

class LogoutController extends Zend_Controller_Action
{

    public function indexAction()
    {
        $userModel = new Application_Model_User();
        // Clear the session and logout user.
        $userModel->logout();
        
        $this->_redirect($this->view->baseUrl());
    }
}

