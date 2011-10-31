<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{

    protected function _initView() 
    {
        $options = $this->getOptions();
        
        $view = new Zend_View($options);
        
        Zend_Dojo::enableView($view);
 
        $view->doctype('XHTML1_STRICT');
        $view->headTitle()->setSeparator(' - ')->append($options['title']);
        $view->headMeta()->appendHttpEquiv('Content-Type',
                                           'text/html; charset=utf-8');
 
//        $view->dojo()->setDjConfigOption('parseOnLoad', true)
//                     ->setLocalPath('/js/dojo/dojo.js')
//                     ->registerModulePath('../spindle', 'spindle')
//                     ->addStylesheetModule('spindle.themes.spindle')
//                     ->requireModule('spindle.main')
//                     ->disable();
 
        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper(
            'ViewRenderer'
        );
        $viewRenderer->setView($view);
 
        return $view;
    }
    
    public function _initDojo() {
        $view = $this->getResource('view');
        $view->addHelperPath('Zend/Dojo/View/Helper/', 'Zend_Dojo_View_Helper');
        $view->dojo()->requireModule('dijit.form.Form');
        
        Zend_Dojo::enableView($view);
        Zend_Dojo_View_Helper_Dojo::setUseDeclarative();
    }
}

