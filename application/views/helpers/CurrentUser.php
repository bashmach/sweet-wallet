<?php

class View_Helper_CurrentUser extends Zend_View_Helper_Abstract
{
    public function currentUser()
    {
        return Zend_Auth::getInstance()->getIdentity();
    }
}
