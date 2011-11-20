<?php 

/**
 * Simple ACL plugin 
 */
class Application_Plugin_Acl extends Zend_Controller_Plugin_Abstract
{
    protected function isLoginPage()
    {
        return $this->_request->getControllerName() == 'login';
    }
    
    public function preDispatch()
    {
        $auth = Zend_Auth::getInstance();
        if (!$auth->hasIdentity() && !$this->isLoginPage()) {
        	//if exist user set role from him
            $this->_request->setControllerName('login');
            $this->_request->setActionName('index');
        }
    }
}