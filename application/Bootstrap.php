<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initConfig()
    {
        Zend_Registry::set('Config', $this->getOptions());
    }

    protected function _initView() 
    {
        $options = $this->getOptions();
        
        $view = new Zend_View($options);
        
        $view->doctype('XHTML1_STRICT');
        $view->headTitle()->setSeparator(' - ')->append($options['title']);
        $view->headMeta()->appendHttpEquiv('Content-Type',
                                           'text/html; charset=utf-8');
        
        $view->addHelperPath(APPLICATION_PATH . '/views/helpers', 'View_Helper');
        
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper(
            'ViewRenderer'
        );
        $viewRenderer->setView($view);
 
        return $view;
    }
}

