<?php

class LoginController extends Zend_Controller_Action
{

    public function indexAction()
    {
        if ($this->_request->isXmlHttpRequest()) {
            $this->_helper->json(array('status' => -1));
        }
        
        $this->view->form = new Application_Form_Login();
        
        if ($this->getRequest()->isPost()) {
            if ($this->view->form->isValid($this->getRequest()->getPost())) {
                
                $email = $this->view->form->getValue('email');
                $password = $this->view->form->getValue('password');
                
                $userModel = new Application_Model_User();
                $authCode = $userModel->login($email, $password);

                // Check the response code from the login function.
                switch ($authCode) {
                    // Authorize user on success response code.
                    case Zend_Auth_Result::SUCCESS:
                        $this->_redirect($this->view->baseUrl());
                        break;
                    case Zend_Auth_Result::FAILURE_IDENTITY_NOT_FOUND:
                        $this->view->form->getElement('email')->addError('Registered user with this email not found.');
                        break;
                    default:
                        $this->view->form->getElement('email')->addError('Wrong auth credentials.');
                        break;
                }
            }
        }
    }
}

